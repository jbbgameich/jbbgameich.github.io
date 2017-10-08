---
layout: post
title:  "Getting text and tables out of PDF files"
date:   2017-10-08 20:53:00 +2:00
categories: misc
---

Recently I wanted to improve the timetable of out school, but it is only available in PDF format which isn't easy to turn into a real html webpage. At least that was what I thought first.
The PDF file contains text on the first page, and a table on the second page.

### Extracting tables

For extracting the table, I used this nice python script [For extracting the table, I used  [this nice python script](https://github.com/ashima/pdf-table-extract).
It's not exaclty fast, but it works fine and has exactly the output formats I needed. It supports exporting the table from a PDF file as json, xml, csv or even, which I needed, html.

```
pdf-table-extract -t table_html -i file.pdf -o file.html -p 2
```

This command scans the second page of a file called file.pdf for a table, and exports it as a pdf file called file.html

After adding a little bit css and html to the generated html table by using a shell script, I only had to set up a cron job to update the timetable every hour. The HTML version is much nicer to use on a mobile device and also on PCs (in my opinion)

### Extracting text

Extracting text is even easier.
This time, I also used a python library like before, called pdfminer. It provides the command `pdf2txt`, which can export the text of inside a PDF file as txt, html, xml and more. The problem with the html export is, that it's sometimes even to exact. It tries to convert images from the pdf file into html to. So often, just using plain text is the best-working option here.
