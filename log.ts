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

/** Log utility
 *
 *  Allow for a easy-to-read log with dynamic levels to identify info, warning, error and whatever
 *  is needed.
 *
 *  Any error in use will throw a "LogError" exception.
 */

type CALLBACK_TYPE = (msg: string) => void;
type LOG_SETTING_TYPE = [string, CALLBACK_TYPE];

/** Log class
 *
 *  All use is static, no need for instanciation?
 */
export class Log {
  /* By default, debug level is disabled */
  protected static debug_activated: boolean = false;
  /* By default, there is no indentation */
  protected static indentation: string = "";
  /* By default, we display all logs */
  protected static display_filters: string[] = [];
  /* log format, Python style, can use keys from custom_data */
  protected static output_format: string = "{indentation}{prefix} {date} > {message}";
  /* Custom data provided by user, like author, module name, version, ... */
  protected static custom_data: {[key: string]: boolean|number|string} = {};
  /** Log level settings
   *
   *  Map a log level to a couple built with the prefix to be displayed and the output callback.
   */
  protected static settings: {[key: string]: LOG_SETTING_TYPE} = {
    info    : ["[i]", console.log],
    warning : ["[!]", console.warn],
    error   : ["[X]", console.error],
    debug   : ["[D]", console.log]
  };

  protected static current_prefix: string = "";
  protected static current_callback: (msg: string) => void = null;
  protected static current_message: string = "";

  protected static error(msg: string): void {
    throw {
      name: "LogError",
      message: msg
    };
  }

  /** Set a number of tabulation to be inserted before each log
   *
   *  Useful when your script is called from another script, which logs too, and you want to
   *  identify easily which log belongs to a script. Said otherwise, it enables a tree structure in
   *  logs.
   *
   *  @param indentation_level the number of tabulations to insert
   */
  public static set_indentation_level(indentation_level: number): void {
    if (indentation_level >= 0) {
      Log.indentation = "";
      while (indentation_level--) {
        /* workaround for lack of a 'repeat' function in some implementations */
        Log.indentation += "\t";
      }
    }
    else {
      Log.error("Indentation level '" + indentation_level + "' is not a positive number");
    }
  }

  /** Activate debug level
   *
   *  @param flag true to activate, false elsewhere
   */
  public static set_debug(flag: boolean): void {
    Log.debug_activated = flag;
  }

  /** Add one or several display filters
   *
   *  Filters must not be already defined.
   *
   *  @param ...filters one are several filter names
   */
  public static add_display_filters(...filters: string[]): void  {
    for (let ifilter in filters) {
      if (Log.display_filters.indexOf(filters[ifilter]) === -1) {
        Log.display_filters.push(filters[ifilter]);
      }
      else {
        Log.error("Filter '" + filters[ifilter] + "' is already defined");
      }
    }
  }

  /** Remove one or several display filters
   *
   *  Filters must be defined.
   *
   *  @param ...filters one are several filter names
   */
  public static remove_display_filters(...filters: string[]): void  {
    for (let ifilter in filters) {
      let index = Log.display_filters.indexOf(filters[ifilter]);
      if (index !== -1) {
        Log.display_filters.splice(index, 1);
      }
      else {
        Log.error("Filter '" + filters[ifilter] + "' does not exist");
      }
    }
  }

  /** Remove all display filters
   *
   */
  public static clear_display_filter(): void {
    Log.display_filters = [];
  }

  /** Add a log level
   *
   *  Log level must not be already defined.
   *
   *  @param level    the name of the level
   *  @param prefix   an optional prefix that will be display at the head of the log line
   *  @param callback an optional output callback that will be used
   */
  public static add_log_level(level: string,
                              prefix: string = "[ ]",
                              callback: CALLBACK_TYPE = console.log): void {
    if (callback) {
      if (!(level in Log.settings)) {
        Log.settings[level] = [prefix, callback];
      }
      else {
        Log.error("Log level '" + level + "' is already defined");
      }
    }
    else {
      Log.error("Output callback can't be null");
    }
  }

  /** Remove a log level
   *
   *  Log level must be defined.
   *
   *  @param level  the name of the level
   */
  public static remove_log_level(level: string): void {
    if (level in Log.settings) {
      if (["info", "warning", "error", "debug"].indexOf(level) === -1) {
        delete Log.settings[level];
      }
      else {
        Log.error("You cannot remove log level '" + level + "'");
      }
    }
    else {
      Log.error("Log level '" + level + "' does not exist");
    }
  }

  /** Add a custom data
   *
   *  @param key    the key, should match the regex \w+
   *  @param value  the value
   */
  public static add_custom_data(key: string, value: any): void {
    if (["indentation", "prefix", "date", "message"].indexOf(key) === -1) {
      if (!(key in Log.custom_data)) {
        Log.custom_data[key] = value;
      }
      else {
        Log.error("Key '" + key + "' is already defined in custom data");
      }
    }
    else {
      Log.error("Reserved key '" + key + "' cannot be defined in custom data");
    }
  }

  /** Remove a custom data
   *
   *  @param key the key
   */
  public static remove_custom_data(key: string): void {
    if (key in Log.custom_data) {
      delete Log.custom_data[key];
    }
    else {
      Log.error("Key '" + key + "' does not exist in custom data");
    }
  }

  /** Set output format
   *
   *  Format must be compliant with Python-like formatting, namely a line like this:
   *  "some log {param1} {param2} stuff stuf {param3}"
   *  Those 'parami' must have been defined in 'custom_data', otherwise they will be left as they
   *  are.
   *
   *  @param format the output format
   */
  public static set_output_format(format: string): void {
    Log.output_format = format;
  }

  protected static renderer(substr: string, ...args: any[]): string {
    if (typeof substr !== "undefined") {
      if (args[0] === "indentation") {
      return Log.indentation;
      }
      else if (args[0] === "prefix") {
        return Log.current_prefix;
      }
      else if (args[0] === "date") {
        let date = new Date();
        return date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + "|" +
               date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      }
      else if (args[0] === "message") {
        return Log.current_message;
      }
      else if (args[0] in Log.custom_data) {
        return "" + Log.custom_data[args[0]];
      }
      else {
        return substr;
      }
    }
  }

  protected static format(prefix, msg, filter): string {
    return Log.output_format.replace(/\{(\w+)\}/g, Log.renderer);
  }

  /** Log something
   *
   *  @param level  the log level used to log
   *  @param msg    the message to log
   *  @param filter an optional display filter
   */
  public static log(level: string, msg: string, filter: string = null): void {
    if (level in Log.settings) {
      Log.current_prefix   = Log.settings[level][0]
      Log.current_callback = Log.settings[level][1];
      Log.current_message = msg;
      if ((level !== "debug") || (Log.debug_activated)) {
        if ((!filter) || (Log.display_filters.indexOf(filter) !== -1)) {
          Log.current_callback(Log.format(Log.current_prefix, msg, filter));
        }
      }
    }
    else {
      Log.error("Log level '" + level + "' does not exist");
    }
  }
}
