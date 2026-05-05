package ru.konconsulting.loyalty;

import android.app.Application;
import com.vk.id.VKID;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        VKID.init(this);
    }
}
