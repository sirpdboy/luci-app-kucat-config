--[[
LuCI - Lua Configuration kucat-config
 Copyright (C) 2022-2024  sirpdboy <herboy2008@gmail.com> https://github.com/sirpdboy/luci-app-kucat-config
]]--

module("luci.controller.kucat-config", package.seeall)

function index()
	if not nixio.fs.access("/etc/config/kucat") then
		return
	end
	local page
	page = entry({"admin","system","kucat-config"},alias("admin","system","kucat-config","kucat-config"),_("KuCat Theme Config"),88)
	page.dependent = true
	page.acl_depends = { "luci-app-kucat-config" }
	entry({"admin","system","kucat-config","kucat-config"},cbi("kucat-config/kucat-config"),_("KuCat Theme Config"),40).leaf = true
	entry({"admin", "system","kucat-config","upload"}, form("kucat-config/upload"), _("Login Background Upload"), 70).leaf = true
	entry({"admin", "system","kucat-config","kucatupload"}, form("kucat-config/kucatupload"), _("Desktop background upload"), 80).leaf = true
end
