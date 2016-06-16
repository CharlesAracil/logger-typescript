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

 /** Log class
  *
  *  All use is static, no need for instantiation?
  */
export class Log {
  protected static settings/*: {[key: string]: any}*/ = {
    tags: {
      info: {
        prefix: "[i]",
        callback: console.log,
      },
      warning: {
        prefix: "[!]",
        callback: console.warn,
      },
      error: {
        prefix: "[X]",
        callback: console.error,
      },
      debug: {
        prefix: "[D]",
        callback: console.log,
      },
      _default: {
        output_format: "{indentation}{prefix} {date} {message}",
        prefix: "[_]",
        callback: console.log,
        /*TODO file: null,*/
      },
      _common: {
        date: null,
        tag: "",
        message: "",
        indentation: "",
        level: "release"
      }
    },
    levels: {
      release: ["debug"],
      debug: []
    },
    data_formatter: {
      date: {
        callback: Log.data_format_date,
        /*TODO data_format: "YYYYMMDD hh:mm:ss"*/
      }
    },
  }

  /************************************** GETTERS & SETTERS ***************************************/

  protected static get_tag_setting(tag_setting: string): any {
    let tag = Log.settings.tags._common.tag;
    let result = null;
    // look into '_common' settings
    if (tag_setting in Log.settings.tags._common) {
      result = Log.settings.tags._common[tag_setting];
    }
    else {
      // if not found in '_common', look into 'tag' settings
      if (tag_setting in Log.settings.tags[tag]) {
        result = Log.settings.tags[tag][tag_setting];
      }
      else {
        // if not found in 'tag' settings, look into '_default' settings
        if (tag_setting in Log.settings.tags._default) {
          result = Log.settings.tags._default[tag_setting];
        }
        else {
          Log.error("Cannot find setting '" + tag_setting + "' for tag '" + tag + "'");
        }
      }
    }
    if (tag_setting in Log.settings.data_formatter) {
      result = Log.settings.data_formatter[tag_setting].callback();
    }
    return result;
  }

  public static set_output_format(output_format: string): void {
    if (output_format) {
      Log.settings.tags._common["output_format"] = output_format;
    }
  }

  public static reset_output_format(): void {
    if ("output_format" in Log.settings.tags._common) {
      delete Log.settings.tags._common["output_format"];
    }
  }

  public static set_indentation(level: number): void {
    if (level >= 0) {
      Log.settings.tags._common.indentation = "";
      while (level--) {
        /* workaround for lack of a 'repeat' function in some implementations */
        Log.settings.tags._common.indentation += "\t";
      }
    }
    else {
      Log.error("Indentation level '" + level + "' is not a positive number");
    }
  }

  public static set_level(level: string): void {
    Log.settings.tags._common.level = level;
  }

  public static add_level(name: string, append: boolean, ...tags: string[]): void {
    // do not affect settings until the end, in case a tag doesn't exists
    let tag_list = [];
    for (let itag in tags) {
      let tag = tags[itag];
      if (tag in Log.settings.tags) {
        tag_list.push(tag);
      }
      else {
        Log.error("Tag '" + tag + "' does not exist");
      }
    }
    if ((!(name in Log.settings.levels)) || (!append)) {
      Log.settings.levels[name] = [];
    }
    Log.settings.levels[name] += tag_list;
  }

  public static delete_level(name: string): void {
    if (name in Log.settings.levels) {
      if (Log.settings.tags._common.level !== name) {
        delete Log.settings.levels[name];
      }
      else {
        Log.error("You cannot delete level '" + name + "' because you're currently using it");
      }
    }
    else {
      Log.error("Level '" + name + "' does not exist");
    }
  }

  public static add_tag(name: string,
                        prefix: string = null,
                        callback: CALLBACK_TYPE = null,
                        overwrite: boolean = false): void {
    if ((!(name in Log.settings.tags)) || overwrite) {
      Log.settings.tags[name] = {};
      if (prefix) {
        Log.settings.tags[name]["prefix"] = prefix;
      }
      if (callback) {
        Log.settings.tags[name]["callback"] = callback;
      }
    }
    else {
      Log.error("Tag '" + name + "' already exists and you did not ask to overwrite");
    }
  }

  public static remove_tag(name: string): void {
    if (name in Log.settings.tags) {
      delete Log.settings.tags[name];
    }
    else {
      Log.error("Tag '" + name + "' does not exist");
    }
  }

  /*************************************** DATA FORMATTERS ****************************************/

  protected static data_format_date(): string {
    let date = new Date();
    return "" + date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate() + "|" +
                date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  }

  /***************************************** CORE METHODS *****************************************/

  protected static error(msg: string): void {
    throw {
      name: "LogError",
      message: msg
    };
  }

  protected static format(): string {
    return Log.get_tag_setting("output_format").replace(
      /(\{+)(\w*)(\}+)/g,
      (substr: string, ...args: any[]) => {
        if (((args[0].length % 2) === 0) || ((args[2].length % 2) === 0) || (args[1].length !== 0)) {
          if ((args[0].length % 2) || (args[2].length % 2)) {
            try {
              args[1] = Log.get_tag_setting(args[1]);
            }
            catch (e) {
              args[1] = substr;
            }
          }
          args[0] = args[0].slice(0, args[0].length / 2);
          args[2] = args[2].slice(0, args[2].length / 2);
          return args[0] + args[1] + args[2];
        }
        else {
          Log.error("Found a single bracket without inner value, brackets need to be paired");
        }
      });
  }

  public static log(tag: string, msg: string): void {
    if (tag in Log.settings.tags) {
      Log.settings.tags._common.tag = tag;
      Log.settings.tags._common.message = msg;
      let display = Log.settings.levels[Log.get_tag_setting("level")].indexOf(tag);
      if (display === -1) {
        (Log.get_tag_setting("callback"))(Log.format());
      }
    }
    else {
      Log.error("Tag '" + tag + "' is not defined");
    }
  }
}
