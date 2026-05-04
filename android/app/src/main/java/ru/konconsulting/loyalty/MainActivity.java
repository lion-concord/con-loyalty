package ru.konconsulting.loyalty;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.vk.id.VKID;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Инициализация VK ID SDK
        try {
            VKID vkid = new VKID(getApplicationContext());
        } catch (Exception e) {
            android.util.Log.e("MainActivity", "Failed to initialize VK ID", e);
        }
    }
}
