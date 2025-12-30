# 🎬 CINEFLIX

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

**CINEFLIX** es una aplicación web moderna y ligera diseñada para los amantes del cine. Permite a los usuarios explorar catálogos de películas, ver tendencias actuales y buscar sus títulos favoritos a través de una interfaz limpia y amigable.

El proyecto está construido utilizando tecnologías web estándar, garantizando un rendimiento rápido y compatibilidad universal sin la necesidad de frameworks pesados.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Uso](#-uso)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🚀 Características

*   **Exploración de Películas**: Visualiza las películas más populares y mejor valoradas del momento.
*   **Búsqueda en Tiempo Real**: Encuentra películas por nombre de manera rápida.
*   **Interfaz Responsiva**: Diseño adaptable que se ve bien en escritorio, tabletas y móviles.
*   **Detalles Informativos**: Accede a información clave como sinopsis, puntuación y fecha de lanzamiento.
*   **Consumo de API**: Integración dinámica con servicios externos para datos actualizados (API Key gestionada en `config.js`).

---

## 🛠 Tecnologías Utilizadas

Este proyecto se basa en los pilares fundamentales del desarrollo web:

*   **HTML5**: Para una estructura semántica y accesible.
*   **CSS3**: Estilos personalizados, diseño responsivo y animaciones fluidas.
*   **JavaScript (ES6+)**: Lógica de la aplicación, manipulación del DOM y peticiones asíncronas (`fetch`) a la API.

---

## 📂 Estructura del Proyecto

```text
CINEFLIX/
├── index.html      # Punto de entrada principal de la aplicación
├── style.css       # Hoja de estilos principal
├── script.js       # Lógica principal y manejo de eventos
├── config.js       # Archivo de configuración (API Keys, URLs base)
├── *.png           # Recursos gráficos y capturas de pantalla
├── LICENSE         # Licencia del proyecto (MIT)
└── README.md       # Documentación del proyecto
```

---

## 🔧 Instalación y Configuración

Sigue estos sencillos pasos para ejecutar el proyecto en tu entorno local:

1.  **Clonar el repositorio**
    ```bash
    git clone https://github.com/JUANCITOPENA/CINEFLIX.git
    cd CINEFLIX
    ```

2.  **Configuración de la API**
    *   Este proyecto requiere una clave de API (probablemente de TMDB o similar).
    *   Abre el archivo `config.js`.
    *   Reemplaza los valores de ejemplo con tu propia API KEY si es necesario:
        ```javascript
        // Ejemplo de contenido en config.js
        const API_KEY = 'TU_API_KEY_AQUI';
        ```

3.  **Ejecutar la aplicación**
    *   Dado que es un proyecto estático (HTML/CSS/JS), no necesitas instalar dependencias de NPM.
    *   Simplemente abre el archivo `index.html` en tu navegador web favorito.
    *   *Recomendación*: Para una mejor experiencia, utiliza una extensión como **Live Server** en VS Code.

---

## 💻 Uso

1.  Al abrir la aplicación, verás la pantalla de inicio con las películas destacadas.
2.  Utiliza la barra de búsqueda para encontrar un título específico.
3.  Haz clic en cualquier tarjeta de película para ver más detalles (si la funcionalidad está implementada).

---

## 🤝 Contribución

¡Las contribuciones son bienvenidas! Si deseas mejorar CINEFLIX, por favor sigue estos pasos:

1.  Haz un **Fork** del repositorio.
2.  Crea una nueva rama para tu funcionalidad (`git checkout -b feature/NuevaFuncionalidad`).
3.  Realiza tus cambios y haz **Commit** (`git commit -m 'Mejora: Agrega barra de navegación'`).
4.  Haz **Push** a la rama (`git push origin feature/NuevaFuncionalidad`).
5.  Abre un **Pull Request**.

---

## 📄 Licencia

Este proyecto está distribuido bajo la licencia **MIT**. Consulta el archivo `LICENSE` para más información.

---

## 📞 Contacto

**Juan Peña** - [Perfil de GitHub](https://github.com/JUANCITOPENA)

Desarrollado con ❤️ y código.