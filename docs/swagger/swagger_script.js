window.onload = () => {
  window.ui = SwaggerUIBundle({
    url: "apidoc",
    dom_id: "#swagger-ui",
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    layout: "StandaloneLayout",
  });
};
