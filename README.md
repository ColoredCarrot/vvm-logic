# VVM Logic

[![Build](https://github.com/ColoredCarrot/vvm-logic/actions/workflows/build.yml/badge.svg)](https://github.com/ColoredCarrot/vvm-logic/actions/workflows/build.yml)

Visualization of a virtual machine for the logic programing language Prolog.

**[Live Preview](https://coloredcarrot.github.io/vvm-logic/)**

![Preview](doc/assets/capture.gif)


## Background

Prolog compiles to an intermediate representation (IR), taking the form of a kind of bytecode.
This IR is then interpreted by a virtual machine (VM).
As Prolog is a logic programming language, its IR and VM are inherently more complex and less intuitive
than traditional machines like the JVM.
VVM Logic visualizes the VM step-by-step to help debug Prolog programs.

This project supports the instructions defined in "Übersetzerbau - Virtuelle Maschinen" (Reinhard Wilhelm, Helmut
Seidl).


## Features

- Visualization of registers, stack, heap, and their relationships
- Step-by-step or automatic execution
- Unlimited Step Back
- Syntax highlighting for IR code
- Live editing, even during code execution
- Compile Prolog directly to IR
- Save to/Load from local files or the browser's local storage
- Clear error messages for illegal instructions or VM states

### Usage

After the input is checked, so no instruction is marked red, you can start the visualization and see the stepwise result
of the registers, stack and heap.
You can also click through every instruction on you own, undo a step or restart the whole program.

If the input program finishes, the result will be shown in the end, otherwise you will see at which program instruction
an error has occurred and what went wrong.

In the end you're able to clean the input field, with the clear button.
If you don't want to write the instructions yourself in the input field, it is also possible to just choose a file and
use as input.

*Hint: You can find example input programs in the /examples folder.*


## Architecture

VVM Logic is a pure client-side SPA, servable via a static web server.
It is implemented in modern Typescript, using ReactJS for the general application layout and cytoscape.js for the
graphical visualization.

The project adheres to the following rules:

- All classes are immutable (using Immutable.js) to improve code maintainability
  and provide the unlimited "Step Back" function.

- Each instruction has an associated unit test that ensures its continued correctnes and protects against regressions.
  Additionally, unit tests exist for most other components.

- Code quality and homogeneity is ensured by a strictly configured eslint.

## Project Status

This project is the result of a three-week collaboration of four German software engineering students
at the Technical University of Munich (TUM).
It was made as part of the Bachelor's Practical Course "Visualization of Virtual Machines" (IN0012, IN4323)
in the winter term 2022/23, supervised by Michael Petter.

While the project may receive updates from time to time, it is not currently under active development.

*Authors: Hannah, Jakob, Julian, Mirella*
