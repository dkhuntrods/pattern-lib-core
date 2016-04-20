{% macro outputBlockXSL(contextData) %}
    {% for loopBlock in contextData %}
    {% for blockId, blockData in loopBlock %}

    {% set blockName = blockId|blockNameFromId %}

        {% include './output-block.xsl' %}

    {% endfor %}
    {% endfor %}
{% endmacro %}

{% macro outputXSLRequires(requireList) %}

{%- for requiredBlockId in requireList -%}
    {%- set reqPath = ''+requiredBlockId|xslEntryPathFromBlockId -%}
    {% include reqPath ignore missing %}
{%- endfor -%}

{% endmacro %}
