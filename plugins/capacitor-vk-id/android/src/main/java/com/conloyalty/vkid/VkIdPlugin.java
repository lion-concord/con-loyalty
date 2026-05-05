package com.conloyalty.vkid;

import android.app.Activity;
import android.util.Log;

import androidx.lifecycle.LifecycleOwner;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import com.vk.id.VKID;
import com.vk.id.VKIDAuthFail;
import com.vk.id.AccessToken;
import com.vk.id.auth.VKIDAuthCallback;
import com.vk.id.auth.AuthCodeData;
import com.vk.id.logout.VKIDLogoutCallback;
import com.vk.id.logout.VKIDLogoutFail;

@CapacitorPlugin(name = "VkId")
public class VkIdPlugin extends Plugin {
    private static final String TAG = "VkIdPlugin";
    private PluginCall savedCall;
    private AccessToken currentToken;

    @PluginMethod
    public void login(PluginCall call) {
        savedCall = call;
        Activity activity = getActivity();
        
        if (activity == null) {
            call.reject("Activity not available");
            return;
        }

        if (!(activity instanceof LifecycleOwner)) {
            call.reject("Activity must implement LifecycleOwner");
            return;
        }

        try {
            VKID vkid = VKID.Companion.getInstance();
            
            VKIDAuthCallback callback = new VKIDAuthCallback() {
                @Override
                public void onAuth(AccessToken accessToken) {
                    currentToken = accessToken;
                    handleSuccess(accessToken);
                }

                @Override
                public void onFail(VKIDAuthFail fail) {
                    handleError(fail);
                }

                @Override
                public void onAuthCode(AuthCodeData authCodeData, boolean isCompletion) {
                    Log.d(TAG, "Auth code received, isCompletion: " + isCompletion);
                }
            };

            // Используем BottomSheet для авторизации
            vkid.authorize(activity, callback);
            
        } catch (Exception e) {
            Log.e(TAG, "Login error", e);
            call.reject("Login failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void logout(PluginCall call) {
        try {
            VKID vkid = VKID.Companion.getInstance();
            
            VKIDLogoutCallback callback = new VKIDLogoutCallback() {
                @Override
                public void onSuccess() {
                    currentToken = null;
                    Log.d(TAG, "Logged out successfully");
                    call.resolve();
                }

                @Override
                public void onFail(VKIDLogoutFail fail) {
                    Log.e(TAG, "Logout failed: " + fail.getDescription());
                    call.reject("Logout failed: " + fail.getDescription());
                }
            };

            vkid.logout(callback);
        } catch (Exception e) {
            Log.e(TAG, "Logout error", e);
            call.reject("Logout failed: " + e.getMessage());
        }
    }

    @PluginMethod
    public void getCurrentUser(PluginCall call) {
        try {
            if (currentToken == null) {
                call.resolve(new JSObject().put("user", JSObject.NULL));
                return;
            }

            JSObject user = new JSObject();
            user.put("accessToken", currentToken.getToken());
            
            JSObject result = new JSObject();
            result.put("user", user);
            result.put("accessToken", currentToken.getToken());

            call.resolve(result);
        } catch (Exception e) {
Log.e(TAG, "Get current user error", e);
            call.reject("Failed to get current user: " + e.getMessage());
        }
    }

    private void handleSuccess(AccessToken accessToken) {
        if (savedCall == null) return;

        try {
            JSObject user = new JSObject();
            user.put("accessToken", accessToken.getToken());

            JSObject result = new JSObject();
            result.put("user", user);
            result.put("accessToken", accessToken.getToken());

            savedCall.resolve(result);
            Log.d(TAG, "Login successful");
        } catch (Exception e) {
            Log.e(TAG, "Handle success error", e);
            savedCall.reject("Failed to process login: " + e.getMessage());
        } finally {
            savedCall = null;
        }
    }

    private void handleError(VKIDAuthFail fail) {
        if (savedCall == null) return;

        String errorMsg = "VK auth failed";
        if (fail != null) {
            errorMsg = fail.getDescription();
        }
        
        Log.e(TAG, "Login failed: " + errorMsg);
        savedCall.reject(errorMsg);
        savedCall = null;
    }
}
