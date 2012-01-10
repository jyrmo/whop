# Whop - array processing
## What it is
Whop is a simulation tool to help people new to programming understand some basic concepts of array processing. It attempts to achieve this goal by visualizing a user written program's execution in real time.

Whop provides its user with a point-and-click programming language to compose an array processing routine. When the routine is run, Whop visualizes the steps in the program's execution in parallel with the array reordering operations as they are being performed. This should give inexperienced programmers valuable insights into how different array reordering methods work. It also challenges them to find effective ways of performing array reordering tasks.

The larger goal of Whop is to make learning programming easier and more fun. Hopefully it will make more people try their hand at programming. 

## How to use it
Whop's web based user interface is divided into three parts: the program listing, the tools and the array visualization pane.

The left pane contains the program listing. It is basically the routine's visual source code. This is where the user sees their program as it is being created and executed.

The middle pane contains the programming language constructs available to the user. These include variables, literals, arithmetic oprations, comparisons, flow control structures and array access operations. Clicking on one of these tools causes the appropriate directive to appear in the listing in the left pane. The new command is added to the listing line which currently has focus. New lines are added automatically. To manually move the program's focus from one listing line to another, click the numbered line identifier at the beginning of the line.

The right pane contains a visual representation of the array to be processed. The array elements are represented as horizontal bars of differing lengths. The integer value of the element is also displayed on each bar. When the program is run (by clicking the "Run" button in the top part of the left pane), each array swapping operation performed, is shown as it happens in this pane. 

## Technical stuff
Whop is written in JavaScript utilizing the jQuery library, which means the deployment is almost trivial - just grab the source and point your browser at index.html. However if this seems too complicated you can try it online [here](http://math.ut.ee/~benzin/whop/).

Currently the project is in a "pre-alpha" stage, meaning that while the main functionality (program creation, running and visualization) has been implemented, there are still quite a few bugs and it is embarrassingly easy to crash the system. In order for it to become reasonably useable a great deal more resources have to be poured into it.

Here is a list of some of the features planned for future versions of Whop:

- Safety checks to avoid syntax errors in the listing
- Editing and deleting lines from the listing
- Reshuffling the array
- Saving the listing for future use
- UI overhaul - the user interface is currently not very attractive
- support for functions and recursion
- exercises - it is not inconceivable to make an educational game out of this program with different array processing tasks to be solved

Plus a whole bunch of bug fixes. All these features and more should be completed in due course, in other words probably never (you can always fork me).