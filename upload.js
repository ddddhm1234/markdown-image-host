const https = require("https");
const fs = require("fs");
async function upload(filePath) {
  var formData = new FormData();
  formData.append(
    "name",
    Math.random().toString(36).slice(2) + Math.random().toString(20).slice(2)
  );
  formData.append("description", Math.random().toString(36).slice(2));
  formData.append("appid", 17767960);
  formData.append("fragment", new Blob([fs.readFileSync(filePath)], { type: "application/zip" }), "TEST-tmp.zip");

  return new Promise((resolve, reject) => {
    const resp = fetch("https://smartprogram.baidu.com/mappconsole/api/savecodefragment", {
      method: "POST",
      body: formData
    })
    resp.then(r => {
      r.text().then(text => {
        try {
          const body = JSON.parse(text);
          const hash = body.data.fragmentHash;
          const resp2 = fetch("https://smartprogram.baidu.com/mappconsole/api/getcodefragment?fragmentHash=" + hash);
          resp2.then(r => {
            r.text().then(text => {
              try {
                const body = JSON.parse(text);
                resolve(body.data.src);
              }
              catch(e) {
                reject(e);
              }
            }).catch(e => {reject(e)});
          })
        }
        catch(e) {
          reject(e);
        }
      }).catch(e => {reject(e)});
    });
    resp.catch(e => {
      reject(e);
    })
  })
}

module.exports = async function(filePath, savePath, markdownPath) {
  // Return a picture access link
  return upload(filePath);
}