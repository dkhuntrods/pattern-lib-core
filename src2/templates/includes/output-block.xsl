{% set blockXSLPath = ''+blockId|xslEntryPathFromBlockId %}

{% if blockXSLPath %}

{% include blockXSLPath ignore missing %}

<xsl:template name="call-{{blockName}}">
    <xsl:for-each select="block[@id='{{blockName}}']">
        <p>{{blockName}}</p>
        <xsl:call-template name="{{blockName}}">
            <xsl:with-param name="data" select="node()"/>
        </xsl:call-template>
        <br/>
    </xsl:for-each>
</xsl:template>

{% endif %}
