<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:ext="http://exslt.org/common">

    <xsl:output method="html" omit-xml-declaration="yes" indent="yes"
     encoding="utf-8"/>

     <xsl:template match="/">
        <xsl:text disable-output-escaping='yes'>&lt;!DOCTYPE html&gt;</xsl:text>
        <html class="no-js" lang="">

            <body>
                <div>
                    <xsl:apply-templates select="root/page/blocks/block"/>
                </div>
                <div>{{page.content|safe}}</div>
            </body>
        </html>
    </xsl:template>

    <xsl:template match="root/page/blocks/block">
        <xsl:copy-of select="node()"/>
    </xsl:template>

</xsl:stylesheet>
