---
layout: post
title:  "How to make life easier for your future self wanting to port your apps to compiled QML"
date:   2020-05-18 23:28:43 +2:00
categories: qt
---

Compiled QML is the new feature in Qt6 which makes many people look forward to the Qt6 release.
Most of us already maintain or contribute to projects which make use of QML,
so let's make sure we can use compiled QML in our projects once its available.

First, a disclaimer: I only started experimenting with this today, and not all my assumptions have to be true in the end. The Qt Company's plans on the changes for Qt 6 are also not yet fixed, which means that things can still change.

```c++
class Parent : public QObject {
public:
    ...
    void setAge(int age);
    void setName(const QString &name);
    ...
private:
    Child *m_firstChild;
    ...
};

class Child : public QObject {
    Child(Parent *parent) : QObject(parent) {
        setAge(4);  // This will not work, and that's good
    };
    ...
};
```

In C++, you can't implicitly access parts of a parent object which is somewhere in memory. This is completely fine and useful, as it forces us to write proper APIs. We are all used to it.
The problem is: in QML you can. Or, rather you **still** can.

```QML
import QtQuick 2.7

Item {
    id: root

    property string helloworld
    function doStuff() {
        console.log("called")
    }

    Item {
        id: child

        Component.onCompleted: {
            helloworld = "Hello World"
            doStuff()
        }
    }
}
```
Unfortunately this code works.

Compiled QML in Qt6 will not have import versioning anymore, which requires that access to properties is fully qualified. If it is not, the meaning can change when an update of an imported dependency adds new properties to the scope.

I found a few rules you can use today to make sure QML code you write in the meantime until Qt6 is released, will not cause you lots of pain later:
 * Don't use unqualified access to functions and properties. This goes as far as not calling `pageStack.push()` from Kirigami this way, since it is a function of the ApplicationWindow. Instead, give the window an id, like `window`, and use `window.pageStack.push()`.
 * Only use properties and functions from children of the type you are working on directly using their object's id (with a few exceptions).
   For everything else, pass every property or object you need using `required property`s. This can be compared to passing variables in the constructor of a C++ class.
 * don't use context properties. Instead use singletons.
 * If your project can depend on Qt 5.14, use the [new syntax](https://doc.qt.io/qt-5/qml-qtqml-connections.html) for the QtQml `Connections {}` object

You can use the `-U` option of a recent `qmllint` to check for unqualified access. For the example above, it will report the following:

```QML
Warning: unqualified access at 15:13
            helloworld = "Hello World"
            ^^^^^^^^^^
Note: helloworld is a member of the root element
      You can qualify the access with its id to avoid this warning:
            root.helloworld = "Hello World"



Warning: unqualified access at 16:13
            doStuff()
            ^^^^^^^
Note: doStuff is a member of the root element
      You can qualify the access with its id to avoid this warning:
            root.doStuff()
```
