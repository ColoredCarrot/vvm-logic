# VVM Logic
Visualization of a virtual machine for the logic programing language Prolog.

## Description
Parse WiM-Instructions (from the book: "Übersetzerbau - Virtuelle Maschinen" by Reinhard Wilhelm, Helmut Seidl) and get a stepwise visualization output.
WiM-Instructions are parsed Prolog instructions. These are necessary for the instruction parser to visualize the program.

### Features
Visualization of the registers: stack pointer, program counter, frame pointer, backtrack pointer, the stack, the heap and all pointers.
See output of parsed instructions, or error message, if something went wrong.

## Usage
After the input is checked, so no instruction is marked red, you can start the visualization and see the stepwise result of the registers, stack and heap.
You can also click through every instruction on you own, undo a step or restart the whole program.

If the input program finishes, the result will be shown in the end, otherwise you will see at which program instruction an error has occurred and what went wrong.

In the end you're able to clean the input field, with the clear button.
If you don't want to write the instructions yourself in the input field, it is also possible to just choose a file and use as input.

*Hint: You can find example input programs in the /examples folder.*


### Project Status
This project is the first version of a virtual machine implemented in typescript, using react as framework for the web app visualization, including cytoscape.js to visualize the graphical view. 
It can have code issues.

### Background
This is made as part of the Bachelor's Practical course - Visualization of Virtual Machines (IN0012, IN4323) at TUM in winter term 2022/23, offered by Michael Petter.

*Authors: Hannah, Jakob, Julian, Mirella*



