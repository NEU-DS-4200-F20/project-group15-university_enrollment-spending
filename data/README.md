# Put any data files in this folder
Ideally your data is a CSV file.

---

The data files included were downloaded from the IPEDS website. The Data_.xlsx file (with underscore) contains expense and enrollment data for all public schools in the United States with more than 1,000 but less than 20,000 students enrolled in 2018. Financial data and enrollment data was combined into one file and additional columns added to calculate the expenses per student, expenses as a percentage of total expenses, and percentage of annual growth. Additionally, column names were revised for readability. The Data.csv file (without underscore) is a subset of that file featuring the nine MA public schools chosen by our end user. This is the file that is read by the webpage.

To feature different schools, find the schools in the Data_.xlsx file and copy the data to the Data.csv file. It is not advised to use more than nine schools, as the visualizations will become quite cluttered and it will be difficult to visually comprehend.

---


*Do not commit personally identifying or confidential data!*
If you do so, it is a pain to remove it later and it may have already been crawled by other sources. But [here is how you do so](https://help.github.com/en/github/authenticating-to-github/removing-sensitive-data-from-a-repository).