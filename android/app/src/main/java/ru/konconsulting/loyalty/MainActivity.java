package ru.konconsulting.loyalty;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.vk.api.sdk.VK;
import com.vk.api.sdk.VKTokenExpiredHandler;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Инициализация VK SDK
        VK.initialize(getApplicationContext());
    }
}
