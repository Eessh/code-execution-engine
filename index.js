const express = require("express");
const app = express();
const cors = require("cors");
const { json } = require("body-parser");
const { exec } = require("child_process");
const fs = require("fs");

const {
    genUUID,
    compileC,
    compileCPP,
    compileRS,
    compileAndRunC,
    compileAndRunCPP,
    runPY,
    compileAndRunRS
} = require("./utils");

// const PORT = process.env.PORT || 5000;
const PORT = 5000;

app.use(cors({origin: "*"}));
app.use(json());

app.get("/favicon", (req, res) => {
    res.sendFile(__dirname + "/public/favicon.ico", (err) => {
        if (err === undefined || err === null) return;
        console.log("Error while sending public/index.html: ", err);
    });
});
app.get("/request_image", (req, res) => {
    res.sendFile(__dirname + "/public/images/request.png", (err) => {
        if (err === undefined || err === null) return;
        console.log("Error while sending request_image: ", err)
    });
});
app.get("/response_image", (req, res) => {
    res.sendFile(__dirname + "/public/images/response.png", (err) => {
        if (err === undefined || err === null) return;
        console.log("Error while sending response_image: ", err)
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html", (err) => {
        if (err === undefined || err === null) return;
        console.log("Error while sending index.html: ", err)
    });
});

app.post("/compile", async (req, res) => {
    const uuid = genUUID();
    if (!fs.existsSync(uuid)) {
        fs.mkdirSync(uuid);
    }
    else {
        fs.rmdirSync(uuid);
        fs.mkdirSync(uuid);
    }

    if (req.body.language === "c") {
        const result = await compileC(req.body.code, uuid);
        res.json(result);
    }
    else if (req.body.language === "cpp") {
        const result = await compileCPP(req.body.code, uuid);
        res.json(result);
    }
    else if (req.body.language === "rs") {
        const result = await compileRS(req.body.code, uuid);
        res.json(result);
    }
    else {
        res.send(`Sorry, ${req.body.language} is not supported :(`);
    }

    exec(`rm -rf ${uuid}`);
});

app.post("/run", async (req, res) => {
    const uuid = genUUID();
    if (!fs.existsSync(uuid)) {
        fs.mkdirSync(uuid);
    }
    else {
        fs.rmdirSync(uuid);
        fs.mkdirSync(uuid);
    }

    try {
        fs.writeFileSync(`${uuid}/input.txt`, req.body.input);
    }
    catch (err) {
        console.log("Error while writing input.txt: ", err);
        res.json({
            code: req.body.code,
            input: req.body.input,
            output: {
                error: "Server Error: " + err,
                stdout: "",
                stderr: ""
            },
        });
    }

    // For C Language
    if (req.body.language === "c") {
        // try {fs.writeFileSync(`${uuid}/code.c`, req.body.code);}
        // catch (err) {console.log("Error while writing code.c: ", err);}
        // exec(`gcc ${uuid}/code.c -o ${uuid}/code && ${uuid}/code < ${uuid}/input.txt`, (error, stdout, stderr) => {
        //     console.log({
        //         error: error,
        //         stdout: stdout,
        //         stderr: stderr
        //     });
        //     res.json({
        //         code: req.body.code,
        //         input: req.body.input,
        //         output: {
        //             error: error,
        //             stdout: stdout,
        //             stderr: stderr
        //         }
        //     });
        //     exec(`rm -rf ${uuid}`);
        // });
        const result = await compileAndRunC(req.body.code, req.body.input, uuid);
        res.json(result);
    }

    // For C++ Language
    else if (req.body.language === "cpp") {
        // try {fs.writeFileSync(`${uuid}/code.cpp`, req.body.code);}
        // catch (err) {console.log("Error while writing code.cpp: ", err);}
        // exec(`g++ -std=c++17 -Wall -Wextra -O2 ${uuid}/code.cpp -o ${uuid}/code && ${uuid}/code < ${uuid}/input.txt`, (error, stdout, stderr) => {
        //     console.log({
        //         error: error,
        //         stdout: stdout,
        //         stderr: stderr
        //     });
        //     res.json({
        //         code: req.body.code,
        //         input: req.body.input,
        //         output: {
        //             error: error,
        //             stdout: stdout,
        //             stderr: stderr
        //         }
        //     });
        //     exec(`rm -rf ${uuid}`);
        // });
        const result = await compileAndRunCPP(req.body.code, req.body.input, uuid);
        res.json(result);
    }

    // For Python Language
    else if (req.body.language === "py") {
        // try {fs.writeFileSync(`${uuid}/code.py`, req.body.code);}
        // catch (err) {console.log("Error while writing code.py: ", err);}
        // exec(`python3 ${uuid}/code.py`, (error, stdout, stderr) => {
        //     console.log({
        //         error: error,
        //         stdout: stdout,
        //         stderr: stderr
        //     });
        //     res.json({
        //         code: req.body.code,
        //         input: req.body.input,
        //         output: {
        //             error: error,
        //             stdout: stdout,
        //             stderr: stderr
        //         }
        //     });
        //     exec(`rm -rf ${uuid}`);
        // });
        const result = await runPY(req.body.code, req.body.input, uuid);
        res.json(result);
    }

    // For Rust Language
    else if (req.body.language === "rs") {
        // try {fs.writeFileSync(`${uuid}/code.rs`, req.body.code);}
        // catch (err) {console.log("Error while writing code.rs: ", err);}
        // exec(`rustc ${uuid}/code.rs -o ${uuid}/code && ${uuid}/code < ${uuid}/input.txt`, (error, stdout, stderr) => {
        //     console.log({
        //         error: error,
        //         stdout: stdout,
        //         stderr: stderr
        //     });
        //     res.json({
        //         code: req.body.code,
        //         input: req.body.input,
        //         output: {
        //             error: error,
        //             stdout: stdout,
        //             stderr: stderr
        //         }
        //     });
        //     exec(`rm -rf ${uuid}`);
        // });
        const result = await compileAndRunRS(req.body.code, req.body.input, uuid);
        res.json(result);
    }
    else {
        res.send(`Sorry, language: ${req.body.language} is not supported :(`);
    }

    exec(`rm -rf ${uuid}`);
});

app.listen(PORT, () => { console.log(`Server running on PORT:${PORT}`) });