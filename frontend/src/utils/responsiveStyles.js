/**
 * Responsive Style Utility for Sports & MICE Admin Website Builder
 * Handles breakpoint configurations, responsive cascades (Desktop -> Tablet -> Mobile),
 * and responsive style generation for both editor canvas and public website.
 */

export const BREAKPOINTS = {
  desktop: { min: 1025, label: 'Desktop', icon: 'desktop', width: '100%' },
  tablet: { min: 769, max: 1024, label: 'Tablet', icon: 'tablet', width: '768px' },
  mobile: { max: 768, label: 'Mobile', icon: 'mobile', width: '390px' }
};

export const DEVICE_VIEWPORTS = ['desktop', 'tablet', 'mobile'];

/**
 * Get responsive property value following the cascade:
 * mobile -> tablet -> desktop -> base fallback
 */
export const getResponsiveValue = (element, property, viewport = 'desktop', defaultValue = '') => {
  if (!element) return defaultValue;

  const resp = element.responsiveStyles || {};

  if (viewport === 'mobile') {
    if (resp.mobile?.[property] !== undefined && resp.mobile?.[property] !== '') {
      return resp.mobile[property];
    }
    if (resp.tablet?.[property] !== undefined && resp.tablet?.[property] !== '') {
      return resp.tablet[property];
    }
    if (resp.desktop?.[property] !== undefined && resp.desktop?.[property] !== '') {
      return resp.desktop[property];
    }
    return element[property] !== undefined && element[property] !== '' ? element[property] : defaultValue;
  }

  if (viewport === 'tablet') {
    if (resp.tablet?.[property] !== undefined && resp.tablet?.[property] !== '') {
      return resp.tablet[property];
    }
    if (resp.desktop?.[property] !== undefined && resp.desktop?.[property] !== '') {
      return resp.desktop[property];
    }
    return element[property] !== undefined && element[property] !== '' ? element[property] : defaultValue;
  }

  // Desktop
  if (resp.desktop?.[property] !== undefined && resp.desktop?.[property] !== '') {
    return resp.desktop[property];
  }
  return element[property] !== undefined && element[property] !== '' ? element[property] : defaultValue;
};

/**
 * Check if a property is explicitly overridden at the current viewport
 */
export const isExplicitlyOverridden = (element, property, viewport = 'desktop') => {
  if (!element || !element.responsiveStyles) return false;
  const val = element.responsiveStyles[viewport]?.[property];
  return val !== undefined && val !== null && val !== '';
};

/**
 * Set a responsive property value on an element/block/section
 */
export const setResponsiveValue = (element, property, value, viewport = 'desktop') => {
  const currentResp = element.responsiveStyles || { desktop: {}, tablet: {}, mobile: {} };
  const updatedResp = {
    ...currentResp,
    [viewport]: {
      ...(currentResp[viewport] || {}),
      [property]: value
    }
  };

  const updatedElement = {
    ...element,
    responsiveStyles: updatedResp
  };

  // If setting desktop value, also sync to top-level property for backwards compatibility
  if (viewport === 'desktop') {
    updatedElement[property] = value;
  }

  return updatedElement;
};

/**
 * Helper to build responsive CSS styles object for an element
 */
export const buildElementStyles = (element, viewport = 'desktop') => {
  if (!element) return {};

  const fontSize = getResponsiveValue(element, 'font_size', viewport) || getResponsiveValue(element, 'size', viewport);
  const textAlign = getResponsiveValue(element, 'align', viewport) || getResponsiveValue(element, 'text_align', viewport);
  const paddingTop = getResponsiveValue(element, 'padding_top', viewport);
  const paddingBottom = getResponsiveValue(element, 'padding_bottom', viewport);
  const paddingLeft = getResponsiveValue(element, 'padding_left', viewport);
  const paddingRight = getResponsiveValue(element, 'padding_right', viewport);
  const marginTop = getResponsiveValue(element, 'margin_top', viewport);
  const marginBottom = getResponsiveValue(element, 'margin_bottom', viewport);
  const marginLeft = getResponsiveValue(element, 'margin_left', viewport);
  const marginRight = getResponsiveValue(element, 'margin_right', viewport);
  const width = getResponsiveValue(element, 'width', viewport);
  const height = getResponsiveValue(element, 'height', viewport);
  const borderRadius = getResponsiveValue(element, 'border_radius', viewport);
  const lineHeight = getResponsiveValue(element, 'line_height', viewport);
  const letterSpacing = getResponsiveValue(element, 'letter_spacing', viewport);

  const style = {};

  if (fontSize) style.fontSize = fontSize.includes('px') || fontSize.includes('rem') || fontSize.includes('em') ? fontSize : `${fontSize}px`;
  if (textAlign) style.textAlign = textAlign;
  if (paddingTop !== '') style.paddingTop = `${paddingTop}px`;
  if (paddingBottom !== '') style.paddingBottom = `${paddingBottom}px`;
  if (paddingLeft !== '') style.paddingLeft = `${paddingLeft}px`;
  if (paddingRight !== '') style.paddingRight = `${paddingRight}px`;
  if (marginTop !== '') style.marginTop = `${marginTop}px`;
  if (marginBottom !== '') style.marginBottom = `${marginBottom}px`;
  if (marginLeft !== '') style.marginLeft = `${marginLeft}px`;
  if (marginRight !== '') style.marginRight = `${marginRight}px`;
  if (width) style.width = width.includes('%') || width.includes('px') || width.includes('vw') || width === 'auto' ? width : `${width}px`;
  if (height) style.height = height.includes('%') || height.includes('px') || height.includes('vh') || height === 'auto' ? height : `${height}px`;
  if (borderRadius) style.borderRadius = borderRadius.includes('px') || borderRadius.includes('%') ? borderRadius : `${borderRadius}px`;
  if (lineHeight) style.lineHeight = lineHeight;
  if (letterSpacing) style.letterSpacing = letterSpacing.includes('px') || letterSpacing.includes('em') ? letterSpacing : `${letterSpacing}px`;

  return style;
};
