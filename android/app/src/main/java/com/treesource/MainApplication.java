package com.treesource;

import android.app.Application;
import com.facebook.react.PackageList;

import android.content.Context;
import android.support.multidex.MultiDex;

import com.crashlytics.android.Crashlytics;
import com.facebook.react.ReactApplication;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import io.realm.react.RealmReactPackage;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.reactnative.photoview.PhotoViewPackage;
import com.airbnb.android.react.maps.MapsPackage;

import fr.bamlab.rnimageresizer.ImageResizerPackage;
import io.invertase.firebase.RNFirebasePackage;

import org.reactnative.camera.RNCameraPackage;

import com.learnium.RNDeviceInfo.RNDeviceInfo;

import io.fabric.sdk.android.Fabric;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
//      return Arrays.<ReactPackage>asList(
//          new AsyncStoragePackage(),
//          new RNDeviceInfo(),
//          new ReactNativePushNotificationPackage(),
//          new RNFirebasePackage(),
//          new RNFirebaseAnalyticsPackage(),
//          new PhotoViewPackage(),
//          new RNCameraPackage(),
//          new RealmReactPackage(),
//          new VectorIconsPackage(),
//          new ImageResizerPackage(),
//          new RNFetchBlobPackage(),
//          new MapsPackage(),
//          new NetInfoPackage()
//      );
      @SuppressWarnings("UnnecessaryLocalVariable")
      List<ReactPackage> packages = new PackageList(this).getPackages();
      // Packages that cannot be autolinked yet can be added manually here, for example:
      // packages.add(new MyReactNativePackage());
      return packages;
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Fabric.with(this, new Crashlytics());
    SoLoader.init(this, false);
  }

  @Override
  protected void attachBaseContext(Context base) {
    super.attachBaseContext(base);
    MultiDex.install(this);
  }
}
