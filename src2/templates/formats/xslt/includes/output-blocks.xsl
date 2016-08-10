{% macro outputBlockXSL(blockIds) %}
    {% for blockId in blockIds %}
        {% set blockName = blockId|blockNameFromId %}
        {% include './output-block.xsl' %}
    {% endfor %}
{% endmacro %}

{% macro outputXSLRequires(requireList) %}

{%- for requiredBlockId in requireList -%}
    {%- set reqPath = ''+requiredBlockId|xslEntryPathFromBlockId -%}
    {% include reqPath ignore missing %}
{%- endfor -%}

{% endmacro %}
