import Application from '@glimmer/application';
import { Simple } from '@glimmer/interfaces';
import { AppBuilder, AppBuilderOptions } from '@glimmer/application-test-helpers';
import { ComponentManager } from '@glimmer/component';
import CustomElementComponentManager from '../../src/custom-element-component-manager';

export class TestApplication extends Application {
  rootElement: Simple.Element;
}

export default function buildApp(appName = 'test-app', options: AppBuilderOptions = {}) {
  options.ApplicationClass = options.ApplicationClass || TestApplication;
  options.ComponentManager = options.ComponentManager || CustomElementComponentManager;
  return new AppBuilder(appName, options);
}
