{% set blockXSLPath = ''+blockId|xslEntryPathFromBlockId %}

{% if blockXSLPath %}

{% include blockXSLPath ignore missing %}

<xsl:template name="call-{{blockName}}">
    <xsl:for-each select="block[@id='{{blockName}}']">
        <xsl:call-template name="{{blockName}}">
            <xsl:with-param name="data" select="."/>
        </xsl:call-template>
    </xsl:for-each>
</xsl:template>

{% endif %}
