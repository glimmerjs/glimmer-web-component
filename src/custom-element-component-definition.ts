import {
  ComponentDefinition as GlimmerComponentDefinition,
  Template
} from '@glimmer/runtime';
import ComponentManager, { ComponentStateBucket } from './custom-element-component-manager';
import { CustomElementComponentFactory } from './custom-element-component';
import { TemplateMeta } from '@glimmer/wire-format';

export default class CustomElementComponentDefinition extends GlimmerComponentDefinition<ComponentStateBucket> {
  componentFactory: CustomElementComponentFactory;
  template: Template<TemplateMeta>;

  constructor(name: string, manager: ComponentManager, template: Template<TemplateMeta>, componentFactory: CustomElementComponentFactory) {
    super(name, manager, componentFactory);

    this.template = template;
    this.componentFactory = componentFactory;
  }

  toJSON() {
    return { GlimmerDebug: `<custom-element-component-definition name="${this.name}">` };
  }
}
