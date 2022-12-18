# Code Execution Engine

A REST api to execute code.

Supported Languages: `C, C++, Python`

### API Endpoint `/run`
Method: `POST`

Body Parameters:
```json
  {
    "language": "py",
    "code": "print(\"Hola\")",
    "input": ""
  }
```
Response:
```json
  {
    "code": "print(\"Hola\")",
    "input": "",
    "output": {
      "error": "",
      "stdout": "Hola",
      "stderr": "",
    }
  }
```
