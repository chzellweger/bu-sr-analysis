# Parse Stadtrats-Präsenz

Reads [PDF-proctocols (INPUT) of the Bernese city council](https://ris.bern.ch/Sitzungen.aspx). Extracts names of present and vacants politicians and writes the result to csv (OUTPUT).

The main work ist done in 
```extractPoliticians.js```. Here you define your regex-patterns to look for in the parsed pdfs and the format of your output to the csv-writer. If you change the current output-format, you will have to change things in ``` writeToCsv.js``` too to get a valid csv.

## Usage

To run your script, run: 

```npm run parse```

To try your parsing or regex on a small number of files, run:

```npm run try```


### Input/Output
Input directory defaults to ```./files/pdf``` or ```./test-content/input```, output directory defaults to ```./files/end-output``` or ```./files/test-content/end-output```. You can customise the folders on run with command line arguments: 

```npm run try|parse [--input <path_to_input_folder> --output <path_to_output_folder>]```

(or: adjust values by hand in ```prodConfig|testConfig``` -object in ```analysis.js``` )

