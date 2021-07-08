# Command line application (Javascript)

## Requirements

### Environment

- `Node.JS`
- `NPM`

### Dependencies

- `axios`
- `boxen`
- `chalk`
- `yargs`

## Usage

Open your computer’s command prompt (Windows) or terminal (macOS/Linux), Change current directory to the project folder and run:

### `npm install -g .`  For initial setup.

To get avergae cubic weight for all products in the "Air Conditioners" category, with conversion factor of 250.
### `calculate -f 250 -c "Air Conditioners"`


> NOTE:  `Usage: calculate -f <conversion factor> -c <"category">`<br /> 
You can customize the `<conversion factor>` and  `<"category">` for the script.<br />
Conversion factor must be greater than zero, and `<"category">` must be within all categories the endpoint provides, else the console will log an error to the user.

To uninstall the script:
### `npm uninstall -g kogan-cli`


