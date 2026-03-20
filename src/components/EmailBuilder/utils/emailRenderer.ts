import type { EmailNode, EmailProject } from '../types';
import { objectToInlineCss } from './inlineCss';

/**
 * Helper to render a grid-based table for containers
 */
const renderGrid = (node: EmailNode, maxWidth: string = '600px', extraStyles: Record<string, string> = {}): string => {
  const { props, children, type } = node;
  const gridCols = props.gridColumns || 1;
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCols = 0;

  children?.forEach(child => {
    const colSpan = Math.min(child.props.colSpan || 1, gridCols);
    
    if (currentCols + colSpan > gridCols && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentCols = 0;
    }

    const childHtml = renderNode(child);
    const colWidth = `${(colSpan / gridCols) * 100}%`;
    const padding = (child.type === 'column' || child.type === 'section') ? '0' : '10px';
    
    currentRow.push(`
      <td width="${colWidth}" colspan="${colSpan}" valign="top" style="width: ${colWidth}; padding: ${padding};">
        ${childHtml}
      </td>
    `);
    currentCols += colSpan;
  });

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  const gridHtml = rows.map(row => `<tr>${row.join('')}</tr>`).join('');

  const containerStyle = objectToInlineCss({
    backgroundColor: props.backgroundColor || (type === 'section' ? 'transparent' : (type === 'header' || type === 'footer' ? '#ffffff' : 'transparent')),
    padding: props.padding || (type === 'section' ? '0' : (type === 'header' ? '20px' : '30px 20px')),
    width: '100%',
    ...extraStyles
  });

  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="${containerStyle}">
      <tr>
        <td align="center">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" class="container-table" style="width:100%; max-width:${maxWidth}; border-collapse: collapse; table-layout: fixed; margin: 0 auto;">
            ${gridHtml || '<tr><td style="padding: 20px;">&nbsp;</td></tr>'}
          </table>
        </td>
      </tr>
    </table>
  `;
};

/**
 * Renders a single node to HTML
 */
const renderNode = (node: EmailNode, settings?: any): string => {
  const { type, props, children } = node;
  const maxWidth = settings?.maxWidth || '600px';

  switch (type) {
    case 'section':
      return renderGrid(node, maxWidth);

    case 'header':
      return renderGrid(node, maxWidth, { borderBottom: '1px solid #eeeeee' });

    case 'footer':
      return renderGrid(node, maxWidth, { borderTop: '1px solid #eeeeee' });

    case 'column':
      const colContent = children ? children.map(c => renderNode(c, settings)).join('') : '';
      return `
        <div style="padding: 10px;">
          ${colContent}
        </div>
      `;

    case 'text':
      const textStyle = objectToInlineCss({
        fontFamily: settings?.fontFamily || props.fontFamily || 'Helvetica, Arial, sans-serif',
        fontSize: props.fontSize || '16px',
        color: props.color || '#333333',
        lineHeight: props.lineHeight || '1.5',
        textAlign: props.textAlign || 'left',
        padding: '10px 0',
      });
      return `<div style="${textStyle}">${props.content || ''}</div>`;

    case 'image':
      const imgStyle = objectToInlineCss({
        display: 'block',
        width: props.width || '100%',
        maxWidth: '100%',
        height: props.height || 'auto',
        objectFit: props.objectFit || 'contain',
        border: '0',
      });
      return `
        <div align="${props.align || 'center'}" style="padding: 10px 0;">
          <img src="${props.src || ''}" alt="${props.alt || ''}" width="${props.width || '100%'}" height="${props.height || 'auto'}" class="responsive-image" style="${imgStyle}" />
        </div>
      `;

    case 'button':
      const btnTableStyle = objectToInlineCss({
        backgroundColor: props.backgroundColor || '#3182ce',
        borderRadius: props.borderRadius || '5px',
        margin: '10px 0',
      });
      const btnLinkStyle = objectToInlineCss({
        display: 'inline-block',
        padding: `${props.paddingY || '12px'} ${props.paddingX || '25px'}`,
        color: props.color || '#ffffff',
        textDecoration: 'none',
        fontSize: props.fontSize || '16px',
        fontWeight: 'bold',
        fontFamily: settings?.fontFamily || 'Helvetica, Arial, sans-serif',
      });
      return `
        <div align="${props.align || 'center'}" style="margin: 10px 0;">
          <table border="0" cellpadding="0" cellspacing="0" style="${btnTableStyle}">
            <tr>
              <td align="center">
                <a href="${props.href || '#'}" target="_blank" style="${btnLinkStyle}">${props.content || 'Button'}</a>
              </td>
            </tr>
          </table>
        </div>
      `;

    case 'divider':
      return `
        <table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr>
            <td style="padding: 20px 0; border-top: ${props.thickness || '1px'} solid ${props.color || '#eeeeee'};"></td>
          </tr>
        </table>
      `;

    case 'spacer':
      return `<div style="height: ${props.height || '20px'}; line-height: ${props.height || '20px'}; font-size: 1px;">&nbsp;</div>`;

    default:
      return '';
  }
};

/**
 * Generates the full Email HTML template
 */
export const generateEmailHtml = (project: EmailProject): string => {
  const { nodes, settings } = project;
  const content = nodes.map(n => renderNode(n, settings)).join('');

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <title>Email Template</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <!--[if mso]>
  <style type="text/css">
    table {border-collapse: collapse !important;}
  </style>
  <![endif]-->
  <style type="text/css">
    @media only screen and (max-width: ${settings.maxWidth}) {
      .container-table { 
        width: 100% !important; 
      }
      .column-cell { 
        display: block !important; 
        width: 100% !important; 
        box-sizing: border-box !important;
      }
      .responsive-image { 
        width: 100% !important; 
        height: auto !important; 
      }
    }
    body {
      margin: 0;
      padding: 0;
      width: 100% !important;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      overflow-x: hidden;
      font-family: ${settings.fontFamily};
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${settings.pageBackgroundColor}; width: 100% !important;">
  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="table-layout: fixed;">
    <tr>
      <td align="center" valign="top" style="background-color: ${settings.pageBackgroundColor}; padding: ${settings.globalPadding};">
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${settings.maxWidth}; background-color: ${settings.contentBackgroundColor}; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05);">
          <tr>
            <td>
              ${content}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
};
