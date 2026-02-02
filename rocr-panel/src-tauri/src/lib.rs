use std::fs;
use std::path::PathBuf;
use tauri::Manager;

fn get_data_path(app: &tauri::AppHandle) -> PathBuf {
    let data_dir = app
        .path()
        .app_data_dir()
        .expect("Failed to get app data directory");
    fs::create_dir_all(&data_dir).ok();
    data_dir.join("data.json")
}

#[tauri::command]
fn read_data(app: tauri::AppHandle) -> Result<String, String> {
    let path = get_data_path(&app);
    match fs::read_to_string(&path) {
        Ok(content) => Ok(content),
        Err(_) => {
            let default = serde_json::json!({
                "contacts": [],
                "partners": [],
                "services": [],
                "content": {},
                "team": []
            });
            let json = serde_json::to_string_pretty(&default).unwrap();
            fs::write(&path, &json).map_err(|e| e.to_string())?;
            Ok(json)
        }
    }
}

#[tauri::command]
fn write_data(app: tauri::AppHandle, data: String) -> Result<(), String> {
    let path = get_data_path(&app);
    fs::write(&path, data).map_err(|e| e.to_string())
}

#[tauri::command]
fn export_data(app: tauri::AppHandle, format: String) -> Result<String, String> {
    let path = get_data_path(&app);
    let content = fs::read_to_string(&path).map_err(|e| e.to_string())?;

    match format.as_str() {
        "json" => Ok(content),
        "csv" => {
            let data: serde_json::Value =
                serde_json::from_str(&content).map_err(|e| e.to_string())?;
            if let Some(contacts) = data.get("contacts").and_then(|c| c.as_array()) {
                let mut csv = String::from("name,email,subject,message,status,date\n");
                for contact in contacts {
                    csv.push_str(&format!(
                        "{},{},{},{},{},{}\n",
                        contact.get("name").and_then(|v| v.as_str()).unwrap_or(""),
                        contact.get("email").and_then(|v| v.as_str()).unwrap_or(""),
                        contact.get("subject").and_then(|v| v.as_str()).unwrap_or(""),
                        contact
                            .get("message")
                            .and_then(|v| v.as_str())
                            .unwrap_or(""),
                        contact
                            .get("status")
                            .and_then(|v| v.as_str())
                            .unwrap_or(""),
                        contact.get("date").and_then(|v| v.as_str()).unwrap_or(""),
                    ));
                }
                Ok(csv)
            } else {
                Err("No contacts data found".to_string())
            }
        }
        _ => Err(format!("Unsupported format: {}", format)),
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![read_data, write_data, export_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
