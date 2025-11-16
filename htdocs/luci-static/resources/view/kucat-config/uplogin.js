'use strict';
'require form';
'require fs';
'require rpc';
'require uci';
'require ui';
'require view';

var callAvailSpace = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'avail'
});

var callRemovekucat = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'remove',
    params: ['filename'],
    expect: { '': {} }
});

var callRenamekucat = rpc.declare({
    object: 'luci.kucatconfig',
    method: 'rename',
    params: ['newname'],
    expect: { '': {} }
});

var bg_path = '/www/luci-static/resources/background/';

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

        m = new form.Map('kucat', _('Login Wallpaper Upload'),
            _('Kucat theme Login background wallpaper upload and management.'));


        var container = E('div', { 'class': 'cbi-map' });

        container.appendChild(E('h3', _('Login Wallpaper Upload')));
        container.appendChild(E('div', { 'class': 'cbi-section-descr' }, [
            E('p', _('Available space: %1024.2mB').format(data[1].avail * 1024)),
            E('p', _('You can upload files in formats such as gif/jpg/png/webm to create your favorite wallpapers')),
            E('p', _('Files will be uploaded to <code>%s</code>.').format(bg_path))
        ]));

        var uploadBtn = E('button', {
            'class': 'btn cbi-button cbi-button-action',
            'style': 'margin: 10px 0;',
            'click': ui.createHandlerFn(this, function(ev) {
                var file = '/tmp/kucat_login_bg.tmp';
                return ui.uploadFile(file, ev.target).then(function(res) {
                    console.log('Upload completed, res:', res);
                    if (!res || !res.name) {
                        throw new Error(_('No file selected or upload failed'));
                    }
                    return L.resolveDefault(callRenamekucat(res.name), {}).then(function(ret) {
                        if (ret && ret.result === 0) {
                            ui.addNotification(null, E('p', _('File uploaded successfully!')));
                            setTimeout(function() {
                                location.reload();
                            }, 1000);
                        } else {
                            var errorMsg = ret ? (ret.error || 'Unknown error') : 'No response from server';
                            ui.addNotification(null, E('p', _('Failed to upload file: %s').format(errorMsg)));
                            return L.resolveDefault(fs.remove(file), {});
                        }
                    }).catch(function(rpcError) {
                        console.error('RPC call error:', rpcError);
                        ui.addNotification(null, E('p', _('RPC call failed: %s').format(rpcError.message || rpcError)));
                        return L.resolveDefault(fs.remove(file), {});
                    });
                }).catch(function(e) {
                    console.error('Upload error:', e);
                    ui.addNotification(null, E('p', _('Upload error: %s').format(e.message)));
                    return L.resolveDefault(fs.remove(file), {});
                });
            })
        }, _('Upload...'));
        
        container.appendChild(uploadBtn);
        container.appendChild(E('div', { 'style': 'text-align: right; font-style: italic;' }, [
                    E('span', {}, [
                        _('© github '),
                        E('a', { 
                            'href': 'https://github.com/sirpdboy', 
                            'target': '_blank',
                            'style': 'text-decoration: none;'
                        }, 'by sirpdboy')
                    ])
                ])
	);

        var files = data[2] || [];
        if (files.length > 0) {
            container.appendChild(E('h3', _('Background file list')));
            
            var tbl = E('table', { 'class': 'table cbi-section-table' }, [
                E('tr', { 'class': 'tr table-titles' }, [
                    E('th', { 'class': 'th' }, [ _('Filename') ]),
                    E('th', { 'class': 'th' }, [ _('Modified date') ]),
                    E('th', { 'class': 'th' }, [ _('Size') ]),
                    E('th', { 'class': 'th' }, [ _('Action') ])
                ])
            ]);

            files.forEach(L.bind(function(file) {
                var row = E('tr', { 'class': 'tr' });
                
                row.appendChild(E('td', { 'class': 'td' }, [ file.name ]));
                row.appendChild(E('td', { 'class': 'td' }, [ 
                    new Date(file.mtime * 1000).toLocaleString() 
                ]));
                row.appendChild(E('td', { 'class': 'td' }, [ 
                    String.format('%1024.2mB', file.size) 
                ]));
                
                var actionCell = E('td', { 'class': 'td' });
                var deleteBtn = E('button', {
                    'class': 'btn cbi-button cbi-button-remove',
                    'click': ui.createHandlerFn(this, function() {
                        if (confirm(_('Are you sure you want to delete %s?').format(file.name))) {
                            return L.resolveDefault(callRemovekucat(file.name), {})
                            .then(function(ret) {
                                if (ret && ret.result === 0) {
                                    ui.addNotification(null, E('p', _('File deleted successfully!')));
                                    location.reload();
                                } else {
                                    ui.addNotification(null, E('p', _('Failed to delete file.')));
                                }
                            });
                        }
                    })
                }, [ _('Delete') ]);
                
                actionCell.appendChild(deleteBtn);
                row.appendChild(actionCell);
                tbl.appendChild(row);
            }, this));

            container.appendChild(tbl);
        } else {
            container.appendChild(E('h3', _('Background file list')));
            container.appendChild(E('p', E('em', _('No files found.'))));
        }

        return container;
    },

    handleSaveApply: null,
    handleSave: null,
    handleReset: null
});
