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

// basics
Log.log("info", "Chris Wedge did the Scrat voice");
Log.set_indentation_level(1);
Log.log("warning", "Do not axe your face!");
Log.set_indentation_level(2);
try {
  // trying wrong indentation level
  Log.set_indentation_level(-1);
}
catch (e) {
  Log.log("error", e.message);
}
Log.log("error", "Segfault at the beginning of the univers, could not stop program, still running");
Log.log("debug", "I love Kim K... wow I was delusional. Hopefully this log won't be print");
Log.set_indentation_level(0);
Log.set_debug(true);
Log.log("debug", "This quark is so charming");

// log level
try {
  // trying to use a log level that does not exist
  Log.log("Maester ShiFu", "I... I will try");
}
catch (e) {
  Log.log("error", e.message);
}
Log.add_log_level("Maester ShiFu", "['°°']", console.warn);
Log.log("Maester ShiFu", "Panda, we do not wash our pits in the Pool of Sacred Tears");
Log.remove_log_level("Maester ShiFu");
Log.add_log_level("Maester ShiFu", "['°°']");
Log.log("Maester ShiFu", "I can control when the fruit will fall!");
Log.remove_log_level("Maester ShiFu");
Log.add_log_level("Nobody");
Log.log("Nobody", "I am nobody");
Log.remove_log_level("Nobody");
try {
  // trying to use a log level that existed but has been removed
  Log.log("Nobody", "... now I am really nobody")
}
catch (e) {
  Log.log("error", e.message);
}

// debug filter
Log.log("debug", "Panier, panier, piano, ...");
Log.log("debug", "One of us! One of us!", "FILTER1");
Log.add_log_filter("FILTER1");
try {
  // add a filter that already exist
  Log.add_log_filter("FILTER1");
}
catch (e) {
  Log.log("error", e.message);
}
Log.log("debug", "Two of us! Two of us!", "FILTER1");
Log.log("debug", "What am I?!", "FILTER2");
try {
  // remove a filter that does not exist
  Log.remove_log_filter("FILTERNOOB");
}
catch (e) {
  Log.log("error", e.message);
}

// multi debug filter
Log.add_log_filter("FILTERA");
Log.log("debug", "Cher ami,", "FILTERA");
Log.log("debug", "Je suis toute émue de vous dire que j'ai", "FILTERA");
Log.add_log_filter("FILTERB", "FILTERC", "FILTERD");
Log.log("debug", "bien compris l'autre jour que vous aviez", "FILTERE");
Log.log("debug", "toujours une envie folle de me faire", "FILTERB");
Log.log("debug", "danser. Je garde le souvenir de votre", "FILTERE");
Log.log("debug", "baiser et je voudrais bien que ce soit", "FILTERC");
Log.remove_log_filter("FILTERB", "FILTERC", "FILTERD");
Log.log("debug", "une preuve que je puisse être aimée", "FILTERA");
Log.log("debug", "par vous.", "FILTERA");
Log.clear_log_filter();
Log.log("debug", "Georges.");
