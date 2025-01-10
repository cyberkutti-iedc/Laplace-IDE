# Laplace IDE

**Laplace IDE** is an intuitive and feature-packed development environment tailored for flashing the Laplace framework onto Laplace boards. Designed with simplicity and efficiency in mind, Laplace IDE empowers developers to seamlessly write, compile, and deploy code.

---

## Features

### 🌟 Integrated Monaco Editor
- **Syntax Highlighting**: Rust-specific syntax with a clean, visually pleasing color scheme.
- **IntelliSense**: Real-time code suggestions and autocompletions.
- **Customizable Font Sizes**: Adjustable font sizes for personalized coding experiences.
- **Error Detection**: Identify syntax and runtime issues as you code.

### 🔧 Serial Monitor
- **Real-Time Communication**: View and debug data from your Laplace board.
- **Send Commands**: Easily transmit data or commands.
- **Configurable Read Intervals**: Toggle and customize automatic reading frequency.

### 📁 File Management
- **New Projects**: Start a fresh project quickly.
- **Open Files and Folders**: Import existing projects or files.
- **Save and Save As**: Easily save your progress or create new versions of your files.

### 🚀 Build and Deploy
- **Code Compilation**: Compile your Rust projects directly within the IDE.
- **Firmware Flashing**: Deploy your code to the Laplace board in just one step.

### 🎨 Thematic Flexibility
- **Light and Dark Modes**: Switch between themes to suit your preference and reduce eye strain.

### 🖥️ User-Friendly Interface
- **Simplified Menus**: Access essential tools like file operations, build settings, and serial monitor with ease.
- **Keyboard Shortcuts**: Accelerate your workflow with intuitive shortcuts:
  - **Save File**: `Ctrl + S` (or `Cmd + S` on macOS).
  - **New File**: `Ctrl + N` (or `Cmd + N`).
  - **Zoom In**: `Ctrl + +` (or `Cmd + +`).
  - **Zoom Out**: `Ctrl + -` (or `Cmd + -`).

---

## How It Works

### Tauri

Laplace IDE is powered by **Tauri**, a cutting-edge toolkit for building native desktop applications with web technologies. Tauri ensures a lightweight, fast, and secure experience.

### Technologies Used
- **TypeScript (TS)**: For clean and scalable frontend code.
- **Rust**: For high-performance, safe, and memory-efficient backend operations.
- **React**: A dynamic library for crafting responsive user interfaces.

### Why Rust?
Rust was chosen for its:
- **Memory Safety**: Avoid common programming errors.
- **Performance**: Compile directly to machine code for optimal efficiency.
- **Concurrency**: Manage complex concurrent tasks with ease.

---

## Installation

### Prerequisites

Before installing Laplace IDE, ensure you have the following:

- **C++ Compiler**: Required for project building.
- **Rust**: Needed to develop and compile Laplace framework projects.

### Installing C++

#### Windows
1. **Install MinGW**:
   - Download the installer from [MinGW](https://sourceforge.net/projects/mingw/).
   - Select the `mingw32-base` and `mingw32-gcc-g++` packages during installation.

2. **Add to System Path**:
   - Add MinGW's `bin` directory to your system's environment `Path`.

#### Linux
1. Install GCC:
   ```bash
   sudo apt update
   sudo apt install build-essential
   ```

#### macOS
1. Install Xcode Command Line Tools:
   ```bash
   xcode-select --install
   ```

### Installing Rust

1. Install Rust via Rustup:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. Add Rust to your environment:
   ```bash
   source $HOME/.cargo/env
   ```

### Install Laplace IDE

1. Clone the Repository:
   ```bash
   git clone https://github.com/laplace-ide/Laplace-ide.git
   cd Laplace-ide
   ```

2. Install Node.js Dependencies:
   ```bash
   npm install
   ```

3. Build the Project:
   ```bash
   npm run build
   ```

4. Run the Application:
   ```bash
   npm run start
   ```

---

## Usage

1. **Open Laplace IDE**.
2. **Create or Open a File**: Use the File menu to begin a project or edit existing code.
3. **Write Code**: Leverage the Monaco Editor for efficient coding.
4. **Build Project**: Compile your project using the Build menu.
5. **Deploy Firmware**: Flash your code to the Laplace board in the Run menu.
6. **Monitor Serial Data**: Interact with the Laplace board using the Serial Monitor.

---

## Contributing

1. **Fork the Repository**.
2. **Clone Your Fork**:
   ```bash
   git clone https://github.com/your-username/laplace-ide.git
   ```
3. **Create a Branch**:
   ```bash
   git checkout -b feature-branch
   ```
4. **Make Your Changes**.
5. **Commit and Push**:
   ```bash
   git commit -m "Add new feature"
   git push origin feature-branch
   ```
6. **Open a Pull Request**.

---

## License

Laplace IDE is open-source software licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For questions or feedback, please email us at [cyberkutti@gmail.com](mailto:cyberkutti@gmail.com).

---

**Laplace IDE**: Your trusted companion for developing and deploying firmware on Laplace boards. 🚀 Happy coding!
