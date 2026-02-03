import "./app.css";
import App from "./App.svelte";

// Svelte 5 client-side mounting
// Import mount from the client module explicitly
import { mount } from "svelte";

const app = mount(App, {
  target: document.getElementById("app"),
});

export default app;
