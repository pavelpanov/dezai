#!/bin/bash
if [ -z "$1" ]
  then
    echo "No locale supplied"
    exit 0
fi

filename="./public/base_translate.html"
output="./public/index.html"
translationsFile="./dezai/locales/hosts/$1.yml"

replaceSearch='<%= t(:\([[:alnum:]]*\)) %>'
search='<%= t\(\:[[:alnum:]]+\) %>'

data=$(cat $filename)
translates=$(cat $translationsFile)
IFS=$'\n'
# sed "s/$search/\1/gi" $filename > $output
for str in $(egrep -io "$search" $filename)
do
 string=$(echo "$str" | sed "s/$replaceSearch/\1/gi")
 result=$(echo "$translates" | grep "$string")
 value=$(echo "$result" | sed "s/$string:\(.*\)/\1/i")
 value=$(echo "$value" | sed "s/^[[:space:]]*//i")
 data=$(echo "$data" | sed "s|$str|$value|gi")
done

# echo "$data"
echo "$data" > $output
