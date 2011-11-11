# Whop
## What it is
A visual programming language to teach sorting algorithms and other array processing concepts to people new to programming. It is coupled with a visualization engine, which demonstrates every reordering operation the program performs while running.
Technically it is a domain specific language meant for reordering a single twenty-element array. As such its possibilities are limited to basic arithmetic, boolean operations, flow control and array access and manipulation.
Whop is written in JavaScript utilizing the jQuery library, which means the deployment is almost trivial - just grab the source and point your browser at index.html.
Currently the project is in a "pre-alpha" stage, meaning that while the main functionality (program creation, running and visualization) has been implemented, there are still quite a few bugs and it is very easy to crash the system. In order for it to become reasonably useable a great deal more resources have to be poured into it.
## How it works
In the middle pane of the user interface are several tools with which you can create your program. The program listing then appears in the left pane. Clicking the "run" button in the upper left corner of the left pane runs the code highlighting each command as it is executed. Simultaneously in the right pane each swap operation on array elements is visualized as it is performed.