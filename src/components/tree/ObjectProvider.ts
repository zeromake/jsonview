
export class ObjectProperty {
  public name: string;
  public value: any;

  constructor(name: string, value: any) {
    this.name = name;
    this.value = value;
  }
}

export const ObjectProvider = {
  getChildren(object: any) {
    const children: ObjectProperty[] = [];
    if (object instanceof ObjectProperty) {
      object = object.value;
    }

    if (!object) {
      return [];
    }

    if (typeof object == "string") {
      return [];
    }

    for (const prop in object) {
      try {
        children.push(new ObjectProperty(prop, object[prop]));
      } catch (e) {
        console.error(e);
      }
    }
    return children;
  },
  hasChildren(object: any) {
    if (object instanceof ObjectProperty) {
      object = object.value;
    }

    if (!object) {
      return false;
    }

    if (typeof object == "string") {
      return false;
    }

    if (typeof object !== "object") {
      return false;
    }

    return !!Object.keys(object).length;
  },
  getLabel(object: any) {
    return object instanceof ObjectProperty ? object.name : null;
  },
  getValue(object: any) {
    return object instanceof ObjectProperty ? object.value : null;
  },
  getKey(object: any) {
    return object instanceof ObjectProperty ? object.name : null;
  },
  getType(object: any) {
    return object instanceof ObjectProperty
      ? typeof object.value
      : typeof object;
  },
}
