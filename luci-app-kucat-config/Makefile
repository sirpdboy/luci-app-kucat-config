include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-kucat-config
PKG_VERSION:=2.0
PKG_RELEASE:=20250304

PKG_MAINTAINER:=jerrykuku <jerrykuku@qq.com>

LUCI_TITLE:=LuCI app for kucat theme configuration
LUCI_PKGARCH:=all
LUCI_DEPENDS:=+luci-theme-kucat

define Package/$(PKG_NAME)/conffiles
/etc/config/kucat
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
