(window.webpackJsonp=window.webpackJsonp||[]).push([[7],{"./src/select/index.mdx":function(e,t,n){"use strict";n.r(t);var l=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/objectWithoutProperties.js"),a=n("react"),o=n.n(a),s=n("./node_modules/@mdx-js/react/dist/index.es.js"),i=(n("./node_modules/docz/dist/index.esm.js"),n("./node_modules/antd/es/select/style/index.js"),n("./node_modules/antd/es/select/index.js")),r=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/classCallCheck.js"),c=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/possibleConstructorReturn.js"),u=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/getPrototypeOf.js"),d=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/createClass.js"),p=n("./node_modules/babel-preset-react-app/node_modules/@babel/runtime/helpers/esm/inherits.js"),b=n("./node_modules/classnames/index.js"),h=n.n(b),m=n("./node_modules/react-window/dist/index.esm.js");"undefined"!==typeof IProps&&IProps&&IProps===Object(IProps)&&Object.isExtensible(IProps)&&Object.defineProperty(IProps,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"IProps",filename:"src\\select\\index.tsx"}}),"undefined"!==typeof IState&&IState&&IState===Object(IState)&&Object.isExtensible(IState)&&Object.defineProperty(IState,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"IState",filename:"src\\select\\index.tsx"}});var f=function(e){function t(e){var n;return Object(r.a)(this,t),(n=Object(c.a)(this,Object(u.a)(t).call(this,e))).select=void 0,n.setRef=function(e){n.select=e},n.lockClose=function(e){e.preventDefault()},n.handleSearch=function(e){n.setState({searchValue:e})},n.handleFocus=function(e){n.setState({focusedOption:e})},n.handleSelect=function(e){var t=n.props,l=t.onChange,a=t.valueKey,o=t.labelKey,s={key:e[a],label:e[o]};l&&l(s),n.setState({value:s,searchValue:"",open:!1},function(){n.select.rcSelect.setInputValue(""),n.select.focus()})},n.handleChange=function(e){var t=n.props,l=t.onChange;t.valueKey,t.labelKey;l&&l(e),n.setState({value:e,searchValue:""})},n.handleDropdownVisibleChange=function(e){n.setState({open:e})},n.handleBlur=function(){n.setState({searchValue:"",focusedOption:null})},n._renderMenu=function(e){var t=n.props,l=t.valueKey,a=t.labelKey,s=t.filterOption,i=n.state,r=i.searchValue,c=i.focusedOption,u=i.value,d=(i.open,s&&r?n.props.options.filter(function(e){return s(r,e)}):n.props.options);if(0===d.length)return e;var p=n._calculateListHeight({options:d}),b=n._optionRenderer;return o.a.createElement("div",{onMouseDown:function(e){return e.preventDefault()},className:"ant-virtualized-select"},o.a.createElement(m.a,{className:"VirtualSelectGrid",height:p,itemCount:d.length,itemSize:function(e){var t=e.index;return n._getOptionHeight({option:d[t]})},width:300},function(e){var t=e.index,o=e.key,s=e.style,i=d[t];return b({focusedOption:c,handleSelect:n.handleSelect,handleFocus:n.handleFocus,key:o,labelKey:a,option:i,optionIndex:t,options:d,style:s,valueArray:u?[u]:null,valueKey:l})}))},n._optionRenderer=function(e){var t=e.focusedOption,n=(e.handleFocus,e.handleSelect),l=e.key,a=e.labelKey,s=e.option,i=e.style,r=e.valueArray,c=e.valueKey,u=h()("ant-virtualized-select-item",s.className,{VirtualizedSelectFocusedOption:s[c]===t,VirtualizedSelectDisabledOption:s.disabled,VirtualizedSelectSelectedOption:r&&r.some(function(e){return e.key===s[c]})}),d=s.disabled?{}:{onClick:function(){return n(s)}};return o.a.createElement("div",Object.assign({className:u,key:l,style:i,title:s[a]},d),s[a])},n.state={value:e.value||e.defaultValue,searchValue:"",focusedOption:null,open:!1},n}return Object(p.a)(t,e),Object(d.a)(t,null,[{key:"getDerivedStateFromProps",value:function(e){return"value"in e?{value:e.value||void 0}:null}}]),Object(d.a)(t,[{key:"render",value:function(){var e=this;return o.a.createElement(i.a,Object.assign({},this.props,{value:this.state.value,ref:this.setRef,open:this.state.open,onSearch:function(t){return e.handleSearch(t)},onChange:this.handleChange,onBlur:function(){return e.handleBlur()},labelInValue:!0,optionLabelProp:this.props.labelKey,onDropdownVisibleChange:this.handleDropdownVisibleChange,dropdownRender:this._renderMenu,dropdownStyle:{overflow:"hidden"}}))}},{key:"_calculateListHeight",value:function(e){for(var t=e.options,n=this.props.maxHeight,l=0,a=0;a<t.length;a++){var o=t[a];if((l+=this._getOptionHeight({option:o}))>n)return n}return l}},{key:"_getOptionHeight",value:function(e){var t=e.option,n=this.props.optionHeight;return n instanceof Function?n({option:t}):n}}]),t}(a.Component);f.defaultProps={maxHeight:240,optionHeight:30,overscanRowCount:10,showSearch:!1,allowClear:!1,labelKey:"label",valueKey:"value",options:[]},"undefined"!==typeof f&&f&&f===Object(f)&&Object.isExtensible(f)&&Object.defineProperty(f,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"VirtualizedSelect",filename:"src\\select\\index.tsx"}}),"undefined"!==typeof f&&f&&f===Object(f)&&Object.isExtensible(f)&&Object.defineProperty(f,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"VirtualizedSelect",filename:"src\\select\\index.tsx"}});n("./src/select/style/index.less");n.d(t,"default",function(){return y});var v=Array.from({length:2e3}).map(function(e,t){return{id:t,name:"test"+t}}),j={},O="wrapper";function y(e){var t=e.components,n=Object(l.a)(e,["components"]);return Object(s.b)(O,Object.assign({},j,n,{components:t,mdxType:"MDXLayout"}),Object(s.b)("h1",{id:"select-\u9009\u62e9\u5668"},"Select \u9009\u62e9\u5668"),Object(s.b)("p",null,"\u4e0b\u62c9\u9009\u62e9\u5668\u3002"),Object(s.b)("h2",{id:"\u57fa\u7840\u5c55\u793a"},"\u57fa\u7840\u5c55\u793a"),Object(s.b)("p",null,"\u5f15\u5165\u7ec4\u4ef6"),Object(s.b)("pre",null,Object(s.b)("code",Object.assign({parentName:"pre"},{}),"import { Select } from 'antd-virtualized';\n")),Object(s.b)("h5",{id:"\u57fa\u7840\u5c55\u793a-1"},"\u57fa\u7840\u5c55\u793a"),Object(s.b)(f,{placeholder:"\u652f\u6301\u5927\u6570\u636e\u7684Select",labelKey:"name",options:v,valueKey:"id",style:{width:120},mdxType:"Select"}),Object(s.b)("h2",{id:"\u57fa\u672c"},"\u57fa\u672c"),Object(s.b)("h3",{id:"api"},"API"),Object(s.b)("h3",{id:"select"},"Select"))}y&&y===Object(y)&&Object.isExtensible(y)&&Object.defineProperty(y,"__filemeta",{enumerable:!0,configurable:!0,value:{name:"MDXContent",filename:"src\\select\\index.mdx"}}),y.isMDXComponent=!0},"./src/select/style/index.less":function(e,t,n){}}]);