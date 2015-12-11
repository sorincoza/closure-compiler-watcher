#Closure compiler watcher

###What is it?
It is a web-based app that watches local JavaScript files for changes and minifies them with Closure compiler.

###How does it work?
I contsntly makes ajax requests to compiler.php file which determines if the file was changes from the last minification. If it was, then it performs a POST request to `http://closure-compiler.appspot.com/compile` and saves the response in another file, after appending ".min.js" to its name.

Ajax requests happen every 2 seconds, except just after the minification, when the timeout is 10 seconds.