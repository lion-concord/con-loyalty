package com.conloyalty.vkid;

import android.util.Log;

import androidx.activity.ComponentActivity;
import androidx.activity.result.ActivityResultLauncher;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.vk.api.sdk.VK;
import com.vk.api.sdk.auth.VKAuthenticationResult;
import com.vk.api.sdk.auth.VKScope;

import java.util.ArrayList;
import java.util.Collection;

@CapacitorPlugin(name = "VkId")
public class VkIdPlugin extends Plugin {
    private static final String TAG = "VkIdPlugin";
    private ActivityResultLauncher<Collection<VKScope>> vkLauncher;
    private PluginCall savedCall;

    @Override
    public void load() {
        super.load();

        ComponentActivity activity = (ComponentActivity) getActivity();
        if (activity == null) {
            Log.e(TAG, "Activity not available during load");
            return;
        }

        // Регистрируем launcher ДО запуска Activity
        vkLauncher = VK.login(activity, result -> {
            if (savedCall == null) {
                Log.e(TAG, "No saved call for VK login result");
                return;
            }

            if (result instanceof VKAuthenticationResult.Success) {
                VKAuthenticationResult.Success successResult = (VKAuthenticationResult.Success) result;

                try {
                    long userId = successResult.getToken().getUserId().getValue();
                    String accessToken = successResult.getToken().getAccessToken();

                    JSObject user = new JSObject();
                    user.put("id", userId);

                    JSObject response = new JSObject();
                    response.put("user", user);
                    response.put("accessToken", accessToken);

                    savedCall.resolve(response);
                } catch (Exception e) {
                    Log.e(TAG, "Error processing VK login result", e);
                    savedCall.reject("Failed to process login result", e);
                }

            } else if (result instanceof VKAuthenticationResult.Failed) {
                VKAuthenticationResult.Failed failedResult = (VKAuthenticationResult.Failed) result;
                savedCall.reject("VK login failed: " + failedResult.getException().getMessage());

            } else {
                savedCall.reject("VK login cancelled");
            }

            savedCall = null;
        });
    }

    @PluginMethod
    public void login(PluginCall call) {
        if (vkLauncher == null) {
            call.reject("VK launcher not initialized");
            return;
        }

        savedCall = call;
        savedCall.setKeepAlive(true);

        Collection<VKScope> scopes = new ArrayList<>();
        scopes.add(VKScope.EMAIL);
        scopes.add(VKScope.PHONE);

        vkLauncher.launch(scopes);
    }

    @PluginMethod
    public void logout(PluginCall call) {
        VK.logout();
        call.resolve();
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        if (!VK.isLoggedIn()) {
call.resolve(new JSObject().put("user", JSObject.NULL));
            return;
        }

        try {
            long userId = VK.getUserId().getValue();

            JSObject user = new JSObject();
            user.put("id", userId);

            JSObject result = new JSObject();
            result.put("user", user);
            call.resolve(result);

        } catch (Exception e) {
            Log.e(TAG, "Error getting current user", e);
            call.reject("Failed to get current user", e);
        }
    }
}
