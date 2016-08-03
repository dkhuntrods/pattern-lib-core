<xsl:template match="blocks">
    {%- for block in blocks -%}
    {%- set blockXSLPath = block.name|getFormatUrlPathForType('xsl') -%}
    {%- if blockXSLPath -%}
    <xsl:call-template name="call-{{block.name}}"/>
    {%- endif -%}
    {%- endfor -%}
</xsl:template>
