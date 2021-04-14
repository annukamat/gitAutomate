const {exec} = require('child_process');

function pushCode(repoName){
    return new Promise(function(res, rej){ 
       let command=`rm -rf .git && git init && git add . && git commit -am "automated commit" && git remote add origin https://github.com/annukamat/${repoName}.git && git checkout -b main && git push -u origin main`
       console.log(command)
        exec(command, (err, stdout, stderr) => {
            if(err){
                console.log(`error: ${err.message}`);
                return rej(err);
            }
            if(stderr) {
                console.log(`stderr: ${stderr}`);
                return rej(err);
            }
            res(stdout);
        });
    })
}
module.exports = { pushCode };