<?xml version="1.0" encoding="UTF-8"?>

{%- from './includes/output-blocks.xsl' import outputBlockXSL, outputXSLRequires %}

<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:msxsl="urn:schemas-microsoft-com:xslt"
    xmlns:ext="http://exslt.org/common">

    <xsl:output method="html" omit-xml-declaration="yes" indent="yes"
    encoding="utf-8"/>

    {{outputXSLRequires(requires)}}
    {{outputBlockXSL(blockIds)}}

    <xsl:template match="/">
        <xsl:apply-templates select="blocks"/>
    </xsl:template>

    <xsl:template match="blocks">
        {% for blockId in blockIds %}
            {% set blockName = blockId|blockNameFromId %}

            {%- set blockXSLPath = blockId|xslEntryPathFromBlockId -%}
            {%- if blockXSLPath -%}
                <xsl:call-template name="call-{{blockName}}"/>
            {%- else -%}
                <div/>
            {%- endif -%}
        {% else %}
            <div/>
        {%- endfor -%}
    </xsl:template>

</xsl:stylesheet>
