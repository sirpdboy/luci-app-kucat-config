#
# Copyright 2023-2025 sirpdboy team <herboy2008@gmail.com>
# This is free software, licensed under the Apache License, Version 2.0 .
#

include $(TOPDIR)/rules.mk
NAME:=kucat
PKG_NAME:=luci-app-$(NAME)
LUCI_TITLE:=LuCI support for Kucat theme setting by sirpdboy
LUCI_DEPENDS:=+curl
LUCI_PKGARCH:=all

PKG_VERSION:=1.1.1
PKG_RELEASE:=20250722

define Package/$(PKG_NAME)/conffiles
/etc/config/kucat
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature


