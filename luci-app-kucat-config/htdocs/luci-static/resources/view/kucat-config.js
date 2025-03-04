'use strict';
'require form';
'require fs';
'require rpc';
'require uci';
'require ui';
'require view';
var callAvailSpace = rpc.declare({
	object: 'luci.kucat',
	method: 'avail'
});

var bg_path = '/www/luci-static/kucat/bg/';
var ts_sets = [0, 0.1, 0.2, 0.3, 0.4,0.5, 0.6, 0.7, 0.8, 0.9, 1 ];
var opacity_sets = [0, 1, 2, 3, 4,5, 6, 7, 8, 9, 10, 20, 30, 50, 100 ];

function createColorPicker(textInput) {
	const colorPicker = document.createElement('input');
	colorPicker.type = 'color';
	colorPicker.value = textInput.value;
	colorPicker.style.width = '24px';
	colorPicker.style.height = '24px';
	colorPicker.style.padding = '0px';
	colorPicker.style.marginLeft = '5px';
	colorPicker.style.borderRadius = '4px';
	colorPicker.style.border = '1px solid #d9d9d9';
	textInput.parentNode.insertBefore(colorPicker, textInput.nextSibling);
	colorPicker.addEventListener('input', function() {
		textInput.value = colorPicker.value;
	});
	textInput.addEventListener('input', function() {
		colorPicker.value = textInput.value;
	});
}

return view.extend({
	load: function() {
		return Promise.all([
			uci.load('kucat'),
			L.resolveDefault(callAvailSpace(), {}),
			L.resolveDefault(fs.list(bg_path), {})
		]);
	},

	render: function(data) {
		var m, s, o;

		m = new form.Map('kucat', _('KuCat Theme Config'),
			_('Set and manage features such as KuCat theme background wallpaper, main background color, partition background, transparency, blur, toolbar retraction and shortcut pointing.'));

		s = m.section(form.TypedSection, 'basic');
		s.addremove = false;
		s.anonymous = true;

		o = s.option(form.ListValue, 'background', _('Wallpaper Source'));
		o.value('0', _('Local wallpaper'));
		o.value('1', _('Auto download Iciba wallpaper'));
		o.value('2', _('Auto download unsplash wallpaper'));
		o.value('3', _('Auto download Bing wallpaper'));
		o.value('4', _('Auto download Bird 4K wallpaper'));
		o.default = '0';
		o.rmempty = false;

		o = s.option(form.Flag, 'bklock', _('Wallpaper synchronization'));
		o.rmempty = false;

		o = s.option(form.Flag, 'setbar', _('Expand Toolbar'));
		o.rmempty = false;

		o = s.option(form.Flag, 'bgqs', _('Refreshing mode'));
		o.default = o.enabled;
		o.rmempty = false;

		o = s.option(form.Flag, 'dayword', _('Enable Daily Word'));
		o.rmempty = false;

		o = s.option(form.ListValue, 'gohome', _('Status Homekey settings'));
		o.value('overview', _('Overview'));
		o.value('online', _('Online User'));
		o.value('realtime', _('Realtime Graphs'));
		o.value('usage', _('Traffic_Status'));
		o.default = 'overview';
		o.rmempty = false;

		o = s.option(form.ListValue, 'gouser', _('System Userkey settings'));
		o.value('advancedplus', _('Advanced plus'));
		o.value('netwizard', _('Inital Setup'));
		o.value('system', _('System'));
		o.value('admin', _('Administration'));
		o.value('filemanager', _('File_Manager'));
		o.default = 'overview';
		o.rmempty = false;

		o = s.option(form.ListValue, 'gossr', _('Services Ssrkey settings'));
		o.value('shadowsocksr', _('SSR'));
		o.value('bypass', _('bypass'));
		o.value('nikki', _('nikki[Mihomo]'));
		o.value('passwall', _('passwall'));
		o.value('passwall2', _('passwall2'));
		o.value('openclash', _('OpenClash'));
		o.value('homeproxy', _('HomeProxy'));
		o.default = 'bypass';
		o.rmempty = false;
		
		o = s.option(form.Flag, 'fontmode', _('Care mode (large font)'));
		o.rmempty = false;

		o = s.option(form.Value, 'progresscolor', _('Progress bar Font Color'))
		o.default = '#146db3e6';
		o.rmempty = false;

		o.render = function(section_id, option_index, cfgvalue) {
			var el = form.Value.prototype.render.apply(this, arguments);
			setTimeout(function() {
				const textInput = document.querySelector('[id^="widget.cbid.kucat."][id$=".progresscolor"]');
				createColorPicker(textInput);
			}, 0);
			return el;
		};

		o = s.option(form.Button, '_save', _('Save settings'));
		o.inputstyle = 'apply';
		o.inputtitle = _('Save current settings');
		o.onclick = function() {
			ui.changes.apply(true);
			return this.map.save(null, true);
		}

		s = m.section(form.TableSection, 'theme', _('Color scheme list'));
		s.addremove = true;
		s.anonymous = true;

		o = s.option(form.Value, 'remarks', _('Remarks'));
		o = s.option(form.Flag, 'use', _('Enable color matching'));
		o.default = o.disabled;
		o.rmempty = false;

		o = s.option(form.ListValue, 'mode', _('Theme mode'));
		o.value('auto', _('Auto'));
		o.value('light', _('Light'));
		o.value('dark', _('Dark'));
		o.default = 'auto';
		o.rmempty = false;

		o = s.option(form.Value, 'primary_rgbm', _('Main Background color(RGB)'));
		o.value('blue',_('RoyalBlue'));
		o.value('green',_('MediumSeaGreen'));
		o.value('orange',_('SandyBrown'));
		o.value('red',_('TomatoRed'));
		o.value('black',_('Black tea eye protection gray'));
		o.value('gray',_('Cool night time(gray and dark)'));
		o.value('bluets',_('Cool Ocean Heart (transparent and bright)'));
		o.default = 'blue';
		o.rmempty = false;
		
		o = s.option(form.Flag, 'bkuse', _('Enable wallpaper'));
		o.default = o.disabled;
		o.rmempty = false;
	
		o = s.option(form.Value, 'primary_rgbm_ts', _('Wallpaper transparency'));
		for (var i of ts_sets)
			o.value(i);
		o.default = '0.9';
		o.rmempty = false;
		
		o = s.option(form.Value, 'primary_opacity', _('Wallpaper blur radius'));
		for (var i of opacity_sets)
			o.value(i);
		o.default = '0';
		o.rmempty = false;

		o = s.option(form.Value, 'primary_rgbs', _('Fence background(RGB)'));
		o.default = '225,112,88';
		o.rmempty = false;

		o = s.option(form.Value, 'primary_rgbs_ts', _('Fence background transparency'));
		for (var i of ts_sets)
			o.value(i);
		o.default = '0.1';
		o.rmempty = false;


		return m.render();
	},

	handleSaveApply: null,
	handleSave: null,
	handleReset: null
});
