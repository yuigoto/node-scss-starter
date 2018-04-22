/**
 * YX : NODE SCSS STARTER
 * ----------------------------------------------------------------------
 * Main JS file, responsible for copying assets, html and transpiling SCSS.
 * 
 * @author    Fabio Y. Goto <lab@yuiti.com.br>
 * @since     0.0.1
 */

// Import libs
const async     = require("async");
const copy      = require("copy");
const express   = require("express");
const fs        = require("fs");
const node_sass = require("node-sass");
const path      = require("path");
const rimraf    = require("rimraf");

// Fire express
const app       = express();
const app_port  = process.env.PORT || 3000;

// Execute using async
async.series(
  [
    // Cleaning build folder
    callback => {
      rimraf(
        "public/",
        err => {
          callback(err, (err) ? false : true)
        }
      )
    }, 
    // Copies HTML
    callback => {
      copy(
        "html/**/*",
        "public", 
        (err, files) => {
          callback(err, files);
        }
      )
    },
    // Copy assets into "public/assets"
    callback => {
      copy(
        "assets/**/*",
        "public/assets",
        (err, files) => {
          callback(err, files);
        }
      );
    },
    // Transpile main SCSS
    callback => {
      node_sass.render(
        {
          file: "scss/main.scss",
          outFile: "public/assets/css/build.min.css", 
          outputStyle: "compressed",
          precision: 8,
          sourceMap: true
        },
        (err, result) => {
          // Create CSS folder and save
          fs.mkdir(
            "public/assets/css",
            err => {
              if (err) {
                console.log("Could not create CSS folder")
              }
            }
          );

          // Save sourcemap and stylesheet
          fs.writeFile(
            "public/assets/css/build.min.css",
            result.css.toString(),
            err => {
              if (err) {
                console.log("Could not save `build.min.css`");
              }
            }
          );
          fs.writeFile(
            "public/assets/css/build.min.css.map",
            result.map.toString(),
            err => {
              if (err) {
                console.log("Could not save `build.min.css`");
              }
            }
          );
          callback(err, result);
        }
      );
    },
    // Serve website
    callback => {
      app.use("/", express.static("public"));
      app.use("/", (req, res) => {
        res.sendFile(
          path.resolve(__dirname, "public", "index.html")
        );
      });
      app.listen(
        app_port,
        err => {
          if (err) {
            console.log("ERROR: Can't serve project");
            console.log(err);
          } else {
            console.log(
                "\x1b[36m---------------------------------------------------------"
            );

            console.log(
                "\x1b[37m[STARTER PACK]: Serving aplication at: http://localhost:" + app_port
            );

            console.log(
                "\x1b[36m[STARTER PACK]: Running watcher on `static` and `assets`"
            );

            console.log(
                "\x1b[33m[STARTER PACK]: Type `rs` and press ENTER to restart\n" + 
                "\x1b[33m[STARTER PACK]: Press CTRL + C to stop"
            );

            console.log(
                "\x1b[36m[STARTER PACK]: Do your thing! ;)"
            );

            console.log(
                "\x1b[36m---------------------------------------------------------\x1b[0m"
            );
          }
        }
      );
      callback(null, true);
    }
  ],
  (err, results) => {
    if (err) {
      console.log("Errors:");
      console.log(err);
      console.log("------------------------------");
      console.log("Resultados das operações:");
      console.log(results);
    }
  }
);
