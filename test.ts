/*
The MIT License (MIT)

Copyright (c) 2016 Charles Aracil

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
*/

/** Test resources
 *
 */

import {Log} from "./log";

/********************************************* BASICS *********************************************/

Log.log("info", "Chris Wedge did the Scrat voice");
Log.set_indentation(1);
Log.log("warning", "Do not axe your face!");
Log.set_indentation(2);
try {
  // trying wrong indentation level
  Log.set_indentation(-1);
}
catch (e) {
  Log.log("error", e.message);
}
Log.log("error", "Segfault when booting the univers, but could not stop it... still running");
Log.set_indentation(0);
Log.log("debug", "I love Kim K... wow I was delusional. Hopefully this log won't be print");
Log.set_level("debug");
Log.log("debug", "This quark is so charming");

/***************************************** CHANGE FORMAT ******************************************/

Log.log("info", "The date today is... at the beginning of this line");
Log.set_output_format("{indentation}{prefix} {date} {message} {date}")
Log.log("info", "The date today is");
Log.reset_output_format();
Log.log("info", "That was clearer");
Log.set_output_format("{indentation}{prefix} {message} {Mad} {Here}")
Log.log("info", "We're all");
Log.set_output_format("{indentation}{prefix} {{}} {{{{}}}}{message} {{message}} {{{message}}}")
Log.log("info", "Pim");
Log.set_output_format("{indentation}{prefix} {{{message}}}}} {{{message}");
Log.log("info", "Poum");
Log.reset_output_format();

/******************************************** ADD TAGS ********************************************/

try {
  // trying to use a log level that doesn't exist
  Log.log("Maester ShiFu", "I... I will try");
}
catch (e) {
  Log.log("error", e.message);
}
Log.add_tag("Maester ShiFu", "['°°']", console.warn);
Log.log("Maester ShiFu", "Panda, we do not wash our pits in the Pool of Sacred Tears");
Log.remove_tag("Maester ShiFu");
try {
  // trying to use a log level that existed but was removed
  Log.log("Maester ShiFu", "I... I will try (again)");
}
catch (e) {
  Log.log("error", e.message);
}
Log.add_tag("Maester ShiFu", "['°°']", console.warn);
Log.log("Maester ShiFu", "I can control when the fruit will fall!");

Log.add_tag("Nobody");
Log.log("Nobody", "I am nobody");
Log.remove_tag("Nobody");

try {
  // trying to remove a tag that doesn't exist
  Log.remove_tag("Nobody");
}
catch (e) {
  Log.log("error", e.message);
}

/****************************************** CHANGE LEVEL ******************************************/
try {
  // trying to add a level refering an unexisting tag
  Log.add_level("fake level", true, "Bobbytag", "Loopytag");
}
catch (e) {
  Log.log("error", e.message);
}
Log.add_tag("DumbAndDumber");
Log.add_tag("AceVentura");
Log.add_level("Mute stupid tags", true, "DumbAndDumber", "AceVentura");
Log.set_level("Mute stupid tags");
Log.log("DumbAndDumber", "You'll have to excuse my friend. He's a little slow");
Log.log("AceVentura", "I came to confess. I was the second gunman on the grassy knoll");
Log.log("info", "Ouf, that was close");
try {
  // trying to remove the level we're currently on
  Log.delete_level("Mute stupid tags");
}
catch (e) {
  Log.log("error", e.message);
}
Log.set_level("release");
Log.log("DumbAndDumber", "You'll have to excuse my friend. He's a little slow");
Log.delete_level("Mute stupid tags");
Log.log("AceVentura", "I came to confess. I was the second gunman on the grassy knoll");
try {
  // trying to remove a level that doesn't exist
  Log.delete_level("Level void");
}
catch (e) {
  Log.log("error", e.message);
}
Log.log("info", "We're near the end...");

/******************************************* FOR FUN... *******************************************/

Log.add_level("Georges", true, "info");
Log.set_level("Georges");

Log.log("warning", "Cher ami,");
Log.log("warning", "Je suis toute émue de vous dire que j'ai");
Log.log("info", "bien compris l'autre jour que vous aviez");
Log.log("warning", "toujours une envie folle de me faire");
Log.log("info", "danser. Je garde le souvenir de votre");
Log.log("warning", "baiser et je voudrais bien que ce soit");
Log.log("info", "une preuve que je puisse être aimée");
Log.log("warning", "par vous.");
Log.log("error", "Georges.");
