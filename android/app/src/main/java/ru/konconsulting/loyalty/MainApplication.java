package ru.konconsulting.loyalty;

import android.app.Application;
import com.vk.id.VKID;

public class MainApplication extends Application {
    @Override
    public void onCreate() {
        super.onCreate();

        // Инициализация VK ID SDK
        VKID.init(this);
    }
}
