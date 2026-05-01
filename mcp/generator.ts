import * as fs from 'fs';
import * as path from 'path';
import { StructuredTestCase } from './parser';
import { DiscoveredElement } from './crawler';

/**
 * Generator class to output TypeScript and Gherkin files.
 * Used by the MCP agent to scaffold artifacts.
 */
export class Generator {
  
  public generateLocatorFile(pageName: string, elements: DiscoveredElement[]) {
    const safeName = pageName.charAt(0).toUpperCase() + pageName.slice(1);
    
    let content = `export const ${safeName}Locator = {\n`;
    elements.forEach((el, index) => {
      const keyName = el.testId ? el.testId.replace(/-([a-z])/g, g => g[1].toUpperCase()) : `element${index}`;
      content += `  ${keyName}: '${el.suggestedLocator}',\n`;
    });
    content += `};\n`;
    
    fs.writeFileSync(path.resolve(process.cwd(), `locators/${pageName.toLowerCase()}.locator.ts`), content);
  }

  public generateFeatureFile(scenario: StructuredTestCase) {
    const safeName = scenario.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
    
    let content = `Feature: ${scenario.title}\n\n`;
    content += `  Scenario: ${scenario.title}\n`;
    scenario.steps.forEach(step => {
      content += `    * ${step}\n`; // Generic bullet, AI replaces with Given/When/Then
    });
    
    fs.writeFileSync(path.resolve(process.cwd(), `features/e2e/${safeName}.feature`), content);
  }
}
