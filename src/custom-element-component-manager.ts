import {
  getOwner,
  setOwner,
  Factory,
  Owner
} from '@glimmer/di';
import {
  Bounds,
  ComponentManager as GlimmerComponentManager,
  DynamicScope,
  Environment,
  CompiledDynamicProgram,
  PreparedArguments,
  Arguments,
  Template,
  compileLayout,
  ComponentLayoutBuilder
} from '@glimmer/runtime';
import {
  TemplateMeta
} from '@glimmer/wire-format';
import { Destroyable, Option, Maybe, unwrap, Dict } from '@glimmer/util';
import { Tag, CONSTANT_TAG } from '@glimmer/reference';
import { Simple } from '@glimmer/interfaces';
import { RootReference } from '@glimmer/component';
import CustomElementComponent from './custom-element-component';
import ComponentDefinition from './custom-element-component-definition';

export interface ConstructorOptions {
  env: Environment;
}

export class ComponentStateBucket {
  public name: string;
  public component: CustomElementComponent;

  constructor(definition: ComponentDefinition, element: Simple.Element, owner: Owner) {
    let componentFactory = definition.componentFactory;
    let name = definition.name;

    let injections = {
      debugName: name,
      element
    };

    setOwner(injections, owner);
    this.component = componentFactory.create(injections);
  }

  get tag(): Tag {
    return CONSTANT_TAG;
  }
}

class LayoutCompiler {
  template: Template<TemplateMeta>;

  constructor(template: Template<TemplateMeta>) {
    this.template = template;
  }

  compile(builder: ComponentLayoutBuilder): void {
    builder.wrapLayout(this.template);
  }
}

export default class CustomElementComponentManager implements GlimmerComponentManager<ComponentStateBucket> {
  private env: Environment;

  static create(options: ConstructorOptions): CustomElementComponentManager {
    return new CustomElementComponentManager(options);
  }

  constructor(options: ConstructorOptions) {
    this.env = options.env;
  }

  prepareArgs(definition: ComponentDefinition, args: Arguments): Option<PreparedArguments> {
    return null;
  }

  create(environment: Environment, definition: ComponentDefinition, volatileArgs: Arguments, dynamicScope: DynamicScope): ComponentStateBucket {
    let owner = getOwner(this.env);
    let shadowRoot: ShadowRoot = unwrap<Dict<any>>(dynamicScope.get('root').value()).parent;
    let element = shadowRoot.host;

    return new ComponentStateBucket(definition, element, owner);
  }

  createComponentDefinition(name: string, template: Template<any>, componentFactory: Maybe<Factory<CustomElementComponent>>): ComponentDefinition {
    if (!componentFactory) {
      componentFactory = {
        class: CustomElementComponent as any,
        create(injections: object) {
          return this.class.create(injections);
        }
      }
    }

    return new ComponentDefinition(name, this, template, unwrap(componentFactory));
  }

  layoutFor(definition: ComponentDefinition, bucket: ComponentStateBucket, env: Environment): CompiledDynamicProgram {
    let template = definition.template;

    return compileLayout(new LayoutCompiler(template), this.env);
  }

  getSelf(bucket: ComponentStateBucket): RootReference {
    return new RootReference(bucket.component);
  }

  didCreateElement(bucket: ComponentStateBucket, element: Simple.Element) {
  }

  didRenderLayout(bucket: ComponentStateBucket, bounds: Bounds) {
  }

  didCreate(bucket: ComponentStateBucket) {
    bucket.component.didAppendLayout();
  }

  getTag({ tag }: ComponentStateBucket): Tag {
    return tag;
  }

  update(bucket: ComponentStateBucket, scope: DynamicScope) {
  }

  didUpdateLayout() {}

  didUpdate(bucket: ComponentStateBucket) {
    bucket.component.didUpdate();
  }

  getDestructor(bucket: ComponentStateBucket): Destroyable {
    return bucket.component;
  }
}
