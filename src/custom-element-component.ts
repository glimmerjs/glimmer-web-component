import Component from '@glimmer/component';

export interface CustomElementComponentFactory {
  create(injections: object): CustomElementComponent;
}

export default class CustomElementComponent extends Component {
  didAppendLayout() { }
}
