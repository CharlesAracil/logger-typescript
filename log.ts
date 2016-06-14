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

/**
 *
 */

type CALLBACK_TYPE = (msg: string) => void;
type LOG_SETTING_TYPE = [string, CALLBACK_TYPE];

export class Log {
  protected static debug_activated: boolean = false;
  protected static indentation: string = "";
  protected static debug_filters: string[] = [];
  protected static settings: {[key: string]: LOG_SETTING_TYPE} = {
    info    : ["[i]", console.log],
    warning : ["[!]", console.warn],
    error   : ["[X]", console.error],
    debug   : ["[D]", console.log]
  };

  protected static error(msg: string): void {
    throw {
      name: "LogError",
      message: msg
    };
  }

  public static set_indentation_level(indentation_level: number): void {
    if (indentation_level >= 0) {
      Log.indentation = "";
      while (indentation_level--) {
        /* workaround to lack of repeat function */
        Log.indentation += "\t";
      }
    }
    else {
      Log.error("Indentation level '" + indentation_level + "' is not a positive number");
    }
  }

  public static set_debug(flag: boolean): void {
    Log.debug_activated = flag;
  }

  public static add_log_filter(...filters: string[]): void  {
    for (let ifilter in filters) {
      if (Log.debug_filters.indexOf(filters[ifilter]) === -1) {
        Log.debug_filters.push(filters[ifilter]);
      }
      else {
        Log.error("Filter '" + filters[ifilter] + "' is already defined");
      }
    }
  }

  public static remove_log_filter(...filters: string[]): void  {
    for (let ifilter in filters) {
      let index = Log.debug_filters.indexOf(filters[ifilter]);
      if (index !== -1) {
        Log.debug_filters.splice(index, 1);
      }
      else {
        Log.error("Filter '" + filters[ifilter] + "' does not exist");
      }
    }
  }

  public static clear_log_filter(): void {
    Log.debug_filters = [];
  }

  public static add_log_level(level: string,
                              prefix: string = "[ ]",
                              callback: CALLBACK_TYPE = console.log): void {
    if (!(level in Log.settings)) {
      Log.settings[level] = [prefix, callback];
    }
    else {
      Log.error("The log level '" + level + "' is already defined");
    }
  }

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
      Log.error("The log level '" + level + "' does not exist");
    }
  }

  public static log(level: string, msg: string, filter: string = null): void {
    if (level in Log.settings) {
      let prefix = Log.settings[level][0]
      let callback = Log.settings[level][1];

      if (level !== "debug") {
        callback(Log.indentation + prefix + " " + msg);
      }
      else if (Log.debug_activated) {
        if (!filter) {
          callback(Log.indentation + prefix + " " + msg);
        }
        else if ((!Log.debug_filters.length) || (Log.debug_filters.indexOf(filter) !== -1)) {
          callback(Log.indentation + prefix + " (" + filter + ") " + msg);
        }
      }
    }
    else {
      Log.error("The log level '" + level + "' does not exist");
    }
  }
}
