{{$ meta }}
title: Using markdown
created: 2014-09-24
author: John Doe
public: yes
{{$ endmeta }}

{{$ layout /layouts/blogentry.html as content }}

Whenever backlift sees a `.md` file it will automatically convert it into an html file, which it will put in the same folder alongside the original. The generated html file exists only on the backlift server, you won't see it added to your Dropbox folder.

In this post I'll demonstrate how you can use [markdown](http://daringfireball.net/projects/markdown/syntax) to quickly write text documents with simple formatting that is turned into HTML.

{{$ break }}

## This is a title

### This is a subtitle 


    Here is some code
           formatted
      however
         you
               like!


> And this is a quote. 

> *- by someone awesome*

[this is a link](#)

*here's some italicized text*

**and some bold text**

***and some bold, italicized text***


Let's make an ordered list:

1.  Here's the first item
2.  and a second one
3.  and a third one


Now an unordered list:

-   Here's an item
-   and another
-   and yet another


## Here's the all the markdown


    ## This is a title

    ### This is a subtitle 


        Here is some code
               formatted
          however
             you
                   like!


    > And this is a quote. 

    > *- by someone awesome*

	[this is a link](#)

    *here's some italicized text*

    **and some bold text**

    ***and some bold, italicized text***


    Let's make an ordered list:

    1.  Here's the first item
    2.  and a second one
    3.  and a third one


    Now an unordered list:

    -   Here's an item
    -   and another
    -   and yet another



